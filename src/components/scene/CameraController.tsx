'use client';

import { useRef, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { useExperience } from '@/context/ExperienceContext';
import { SECTIONS } from '@/lib/experience-config';

// Hermite cubic smoothstep interpolation
function smooth(t: number): number {
  const c = Math.max(0, Math.min(1, t));
  return c * c * (3 - 2 * c);
}

export function CameraController() {
  const { camera, size, gl } = useThree();
  const { scrollProgress, isReducedMotion, activeSection, setIsCameraAtProjector } = useExperience();

  // Reusable pooled vectors to avoid garbage collection inside animation frames
  const currentPos = useRef(new THREE.Vector3(0, 2.1, 7.2));
  const currentLookAt = useRef(new THREE.Vector3(0, 1.7, 0));
  const destPos = useRef(new THREE.Vector3(0, 2.1, 7.2));
  const destLookAt = useRef(new THREE.Vector3(0, 1.7, 0));
  const targetFov = useRef(48);
  const isCameraAtProjectorRef = useRef(false);

  // Intentional mouse/trackpad zoom offset in Journey mode
  const journeyZoomOffset = useRef(0);
  const targetJourneyZoomOffset = useRef(0);
  const lastProgressRef = useRef(scrollProgress);

  // Natural 360° Drag-to-Look State
  const targetYaw = useRef(0);
  const targetPitch = useRef(0);
  const currentYaw = useRef(0);
  const currentPitch = useRef(0);
  const isDraggingLook = useRef(false);
  const lastPointer = useRef({ x: 0, y: 0 });

  // Determine mobile aspect ratio and screen width
  const isMobile = size.width < 768 || size.width / Math.max(1, size.height) < 1.0;

  // Trackpad pinch gesture, Ctrl+Wheel zoom & Mobile touch gestures
  useEffect(() => {
    const canvasDom = gl.domElement;
    if (!canvasDom) return;

    let initialPinchDist: number | null = null;

    const handleWheel = (e: WheelEvent) => {
      // Intentional zoom on trackpad pinch (ctrlKey) or when holding Ctrl
      if (e.ctrlKey) {
        e.preventDefault();
        const zoomDelta = -e.deltaY * 0.003;
        targetJourneyZoomOffset.current = THREE.MathUtils.clamp(
          targetJourneyZoomOffset.current + zoomDelta,
          -2.0,
          2.2
        );
      }
    };

    // Mobile two-finger pinch-to-zoom
    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length === 2) {
        isDraggingLook.current = false;
        const dx = e.touches[0].clientX - e.touches[1].clientX;
        const dy = e.touches[0].clientY - e.touches[1].clientY;
        const dist = Math.sqrt(dx * dx + dy * dy);

        if (initialPinchDist !== null) {
          const delta = (dist - initialPinchDist) * 0.006;
          targetJourneyZoomOffset.current = THREE.MathUtils.clamp(
            targetJourneyZoomOffset.current + delta,
            -2.0,
            2.2
          );
        }
        initialPinchDist = dist;
      }
    };

    const handleTouchEnd = () => {
      initialPinchDist = null;
    };

    canvasDom.addEventListener('wheel', handleWheel, { passive: false });
    canvasDom.addEventListener('touchmove', handleTouchMove, { passive: true });
    canvasDom.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvasDom.removeEventListener('wheel', handleWheel);
      canvasDom.removeEventListener('touchmove', handleTouchMove);
      canvasDom.removeEventListener('touchend', handleTouchEnd);
    };
  }, [gl]);

  // Natural Drag-to-Look Pointer Listeners
  useEffect(() => {
    const canvasDom = gl.domElement;
    if (!canvasDom) return;

    const handlePointerDown = (e: PointerEvent) => {
      // Check global flags for desktop window drag or globe rotation
      if (typeof window !== 'undefined') {
        const win = window as unknown as {
          __isInteractingWithObject?: boolean;
          __isDraggingWindow?: boolean;
        };
        if (win.__isInteractingWithObject || win.__isDraggingWindow) return;
      }

      // If clicking interactive UI controls (buttons, links, inputs, window titlebars, folder icons, or desktop screen), leave interaction to UI
      const targetEl = e.target as HTMLElement | null;
      if (targetEl && targetEl.closest('button, a, input, textarea, select, [role="button"], .cursor-move, [tabindex="0"], [data-desktop-screen="true"]')) {
        return;
      }
      if (e.button !== 0 && e.pointerType === 'mouse') return;

      isDraggingLook.current = true;
      lastPointer.current = { x: e.clientX, y: e.clientY };
      document.body.style.cursor = 'grabbing';
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDraggingLook.current) return;

      // Abort if another component started interacting
      if (typeof window !== 'undefined') {
        const win = window as unknown as {
          __isInteractingWithObject?: boolean;
          __isDraggingWindow?: boolean;
        };
        if (win.__isInteractingWithObject || win.__isDraggingWindow) {
          isDraggingLook.current = false;
          document.body.style.cursor = 'auto';
          return;
        }
      }

      const dx = e.clientX - lastPointer.current.x;
      const dy = e.clientY - lastPointer.current.y;
      lastPointer.current = { x: e.clientX, y: e.clientY };

      const sensitivity = e.pointerType === 'touch' ? 0.0042 : 0.0034;

      // Continuous, full 360-degree azimuthal rotation around Y axis
      targetYaw.current += dx * sensitivity;

      // Wide, natural vertical elevation range (up to ceiling lights, down to floor)
      targetPitch.current = THREE.MathUtils.clamp(
        targetPitch.current - dy * sensitivity,
        -1.15,
        1.15
      );
    };

    const handlePointerUp = () => {
      isDraggingLook.current = false;
      document.body.style.cursor = 'auto';
    };

    window.addEventListener('pointerdown', handlePointerDown);
    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown);
      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
      window.removeEventListener('pointercancel', handlePointerUp);
      document.body.style.cursor = 'auto';
    };
  }, [gl]);

  // Compute camera waypoints along the journey destinations
  useEffect(() => {
    // Responsive mobile framing adjustments
    const mobileZOffset = isMobile ? 0.65 : 0;
    const mobileYOffset = isMobile ? 0.12 : 0;

    const targetSection = SECTIONS.find((s) => s.id === activeSection) || SECTIONS[1];

    if (activeSection === 'workstation') {
      const viewportAspect = size.width / Math.max(1, size.height);
      const fovRad = THREE.MathUtils.degToRad(targetSection.fov);
      // Screen is 4.40m wide x 2.475m high (16:9 ratio) at [-1.2, 2.22, -4.45]
      // To cover the screen edge-to-edge with no surrounding borders or room visible:
      const dHeight = (2.475 / 2) / Math.tan(fovRad / 2);
      const dWidth = (4.40 / (2 * viewportAspect)) / Math.tan(fovRad / 2);
      const coverDistance = Math.min(dHeight, dWidth) * 0.985;

      destPos.current.set(-1.2, 2.22, -4.45 + coverDistance);
      destLookAt.current.set(-1.2, 2.22, -4.45);
      targetFov.current = targetSection.fov;
    } else {
      destPos.current.set(
        targetSection.cameraPosition[0],
        targetSection.cameraPosition[1] + mobileYOffset,
        targetSection.cameraPosition[2] + mobileZOffset
      );
      destLookAt.current.set(
        targetSection.cameraTarget[0],
        targetSection.cameraTarget[1],
        targetSection.cameraTarget[2]
      );
      targetFov.current = targetSection.fov;
    }

    // Smoothly settle manual zoom offset when moving to a new station
    targetJourneyZoomOffset.current = THREE.MathUtils.lerp(targetJourneyZoomOffset.current, 0, 0.4);
    lastProgressRef.current = scrollProgress;
  }, [scrollProgress, isMobile, activeSection, size.width, size.height]);

  useFrame((_, delta) => {
    // Smooth lerp factor based on motion preference
    const lerpFactor = isReducedMotion ? 0.45 : Math.min(1, delta * 4.4);

    // Settle drag look-offset gently when scrolling to a new station
    if (Math.abs(scrollProgress - lastProgressRef.current) > 0.005) {
      targetYaw.current = THREE.MathUtils.lerp(targetYaw.current, 0, 0.08);
      targetPitch.current = THREE.MathUtils.lerp(targetPitch.current, 0, 0.08);
    }

    // Damped interpolation of drag-to-look rotation
    const lookDamping = Math.min(1, delta * 8.5);
    currentYaw.current = THREE.MathUtils.lerp(currentYaw.current, targetYaw.current, lookDamping);
    currentPitch.current = THREE.MathUtils.lerp(currentPitch.current, targetPitch.current, lookDamping);

    // Interpolate intentional zoom offset
    journeyZoomOffset.current = THREE.MathUtils.lerp(
      journeyZoomOffset.current,
      targetJourneyZoomOffset.current,
      lerpFactor
    );

    // Base view direction from camera to destination target
    const baseDir = new THREE.Vector3().subVectors(destLookAt.current, destPos.current);
    const lookDist = Math.max(1.0, baseDir.length());
    baseDir.normalize();

    // Rotate gaze naturally: Yaw around world Y axis, Pitch around camera local right axis
    const rotatedDir = baseDir.clone();
    rotatedDir.applyAxisAngle(new THREE.Vector3(0, 1, 0), -currentYaw.current);
    const rightAxis = new THREE.Vector3().crossVectors(rotatedDir, new THREE.Vector3(0, 1, 0)).normalize();
    rotatedDir.applyAxisAngle(rightAxis, currentPitch.current);

    const finalDestPos = destPos.current.clone().addScaledVector(rotatedDir, journeyZoomOffset.current);

    // Safe room bounds clamping to prevent clipping through walls, floor, or ceiling
    finalDestPos.x = THREE.MathUtils.clamp(finalDestPos.x, -3.8, 3.8);
    finalDestPos.y = THREE.MathUtils.clamp(finalDestPos.y, 0.95, 3.4);
    finalDestPos.z = THREE.MathUtils.clamp(finalDestPos.z, -3.8, 6.8);

    currentPos.current.lerp(finalDestPos, lerpFactor);

    // Final gaze look target with drag-to-look direction
    const targetLookAt = currentPos.current.clone().addScaledVector(rotatedDir, lookDist);
    currentLookAt.current.lerp(targetLookAt, lerpFactor);

    camera.position.copy(currentPos.current);
    camera.lookAt(currentLookAt.current);

    // Report camera arrival at Projector Station
    if (activeSection === 'projects') {
      const distToDest = currentPos.current.distanceTo(finalDestPos);
      const lookDistDiff = currentLookAt.current.distanceTo(targetLookAt);
      if (distToDest < 0.14 && lookDistDiff < 0.18) {
        if (!isCameraAtProjectorRef.current) {
          isCameraAtProjectorRef.current = true;
          setIsCameraAtProjector(true);
        }
      }
    } else {
      if (isCameraAtProjectorRef.current) {
        isCameraAtProjectorRef.current = false;
        setIsCameraAtProjector(false);
      }
    }

    // Interpolate cinematic camera field of view
    const perspCamera = camera as THREE.PerspectiveCamera;
    if (Math.abs(perspCamera.fov - targetFov.current) > 0.05) {
      perspCamera.fov = THREE.MathUtils.lerp(perspCamera.fov, targetFov.current, lerpFactor);
      perspCamera.updateProjectionMatrix();
    }
  });

  return null;
}
