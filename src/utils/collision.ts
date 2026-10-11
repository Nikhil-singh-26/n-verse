import { BUILDINGS_DATA } from "@/data/buildingsData";

export interface BoxCollider {
  id: string;
  name: string;
  centerX: number;
  centerZ: number;
  halfWidth: number;  // X half-extent in local space
  halfDepth: number;  // Z half-extent in local space
  rotation: number;   // Y-rotation in radians
}

export interface CircleCollider {
  id: string;
  name: string;
  centerX: number;
  centerZ: number;
  radius: number;
}

// 1. Generate box colliders for all 6 village buildings
// Building structures have footprint of ~6.6m width x ~6.6m depth
// Half-extents: 3.4m width, 3.4m depth covers the walls, corners, and closed/open doorway
export const BUILDING_COLLIDERS: BoxCollider[] = BUILDINGS_DATA.map((b) => ({
  id: b.id,
  name: b.name,
  centerX: b.position[0],
  centerZ: b.position[2],
  halfWidth: 3.35,
  halfDepth: 3.35,
  rotation: b.rotation,
}));

// 2. Central village plaza monument collider (prevents walking through stone basin & crest)
export const PLAZA_MONUMENT_COLLIDER: CircleCollider = {
  id: "central_monument",
  name: "Plaza Monument",
  centerX: 0,
  centerZ: 0,
  radius: 1.65,
};

/**
 * Resolves player circle collision against an Oriented Bounding Box (OBB).
 * If colliding, calculates the minimum pushout vector to separate the player from the box.
 */
function resolveBoxCollision(
  px: number,
  pz: number,
  box: BoxCollider,
  playerRadius: number
): { x: number; z: number; collided: boolean } {
  // 1. Transform player into box's local space
  const dx = px - box.centerX;
  const dz = pz - box.centerZ;
  const cos = Math.cos(-box.rotation);
  const sin = Math.sin(-box.rotation);

  const localX = dx * cos - dz * sin;
  const localZ = dx * sin + dz * cos;

  const hx = box.halfWidth;
  const hz = box.halfDepth;

  // 2. Check if player is inside or intersecting the box
  const clampedX = Math.max(-hx, Math.min(hx, localX));
  const clampedZ = Math.max(-hz, Math.min(hz, localZ));

  const diffX = localX - clampedX;
  const diffZ = localZ - clampedZ;
  const distSq = diffX * diffX + diffZ * diffZ;

  // Case A: Player center is inside the box
  if (localX >= -hx && localX <= hx && localZ >= -hz && localZ <= hz) {
    // Find closest edge to push out
    const distToLeft = localX - -hx;
    const distToRight = hx - localX;
    const distToBack = localZ - -hz;
    const distToFront = hz - localZ;

    const minDist = Math.min(distToLeft, distToRight, distToBack, distToFront);

    let pushLocalX = localX;
    let pushLocalZ = localZ;

    if (minDist === distToLeft) {
      pushLocalX = -hx - playerRadius;
    } else if (minDist === distToRight) {
      pushLocalX = hx + playerRadius;
    } else if (minDist === distToBack) {
      pushLocalZ = -hz - playerRadius;
    } else {
      pushLocalZ = hz + playerRadius;
    }

    // Transform resolved position back to world space
    const cosR = Math.cos(box.rotation);
    const sinR = Math.sin(box.rotation);
    const worldX = box.centerX + pushLocalX * cosR - pushLocalZ * sinR;
    const worldZ = box.centerZ + pushLocalX * sinR + pushLocalZ * cosR;

    return { x: worldX, z: worldZ, collided: true };
  }

  // Case B: Player center is outside the box, but within playerRadius of the box surface
  if (distSq < playerRadius * playerRadius && distSq > 0.00001) {
    const dist = Math.sqrt(distSq);
    const overlap = playerRadius - dist;
    const nx = diffX / dist;
    const nz = diffZ / dist;

    const pushLocalX = localX + nx * overlap;
    const pushLocalZ = localZ + nz * overlap;

    const cosR = Math.cos(box.rotation);
    const sinR = Math.sin(box.rotation);
    const worldX = box.centerX + pushLocalX * cosR - pushLocalZ * sinR;
    const worldZ = box.centerZ + pushLocalX * sinR + pushLocalZ * cosR;

    return { x: worldX, z: worldZ, collided: true };
  }

  return { x: px, z: pz, collided: false };
}

/**
 * Resolves player circle collision against a circle obstacle (e.g. fountain monument).
 */
function resolveCircleCollision(
  px: number,
  pz: number,
  circle: CircleCollider,
  playerRadius: number
): { x: number; z: number; collided: boolean } {
  const dx = px - circle.centerX;
  const dz = pz - circle.centerZ;
  const distSq = dx * dx + dz * dz;
  const minDist = circle.radius + playerRadius;

  if (distSq < minDist * minDist) {
    const dist = Math.sqrt(distSq);
    if (dist > 0.0001) {
      const nx = dx / dist;
      const nz = dz / dist;
      return {
        x: circle.centerX + nx * minDist,
        z: circle.centerZ + nz * minDist,
        collided: true,
      };
    } else {
      // Direct center overlap fallback
      return {
        x: circle.centerX + minDist,
        z: circle.centerZ,
        collided: true,
      };
    }
  }

  return { x: px, z: pz, collided: false };
}

/**
 * Checks and resolves player position against all village obstacles.
 * Performs two relaxation iterations to smoothly resolve corner collisions.
 */
export function resolveVillageCollisions(
  px: number,
  pz: number,
  playerRadius = 0.45
): { x: number; z: number; collided: boolean } {
  let currX = px;
  let currZ = pz;
  let anyCollided = false;

  // Run 2 iterations for clean corner resolution
  for (let iter = 0; iter < 2; iter++) {
    // 1. Check all 6 building box colliders
    for (const box of BUILDING_COLLIDERS) {
      const res = resolveBoxCollision(currX, currZ, box, playerRadius);
      if (res.collided) {
        currX = res.x;
        currZ = res.z;
        anyCollided = true;
      }
    }

    // 2. Check central monument
    const monumentRes = resolveCircleCollision(
      currX,
      currZ,
      PLAZA_MONUMENT_COLLIDER,
      playerRadius
    );
    if (monumentRes.collided) {
      currX = monumentRes.x;
      currZ = monumentRes.z;
      anyCollided = true;
    }
  }

  return { x: currX, z: currZ, collided: anyCollided };
}

/**
 * Ray-segment intersection against a 2D Oriented Bounding Box.
 * Used for camera occlusion prevention: checks if ray from player to camera clips a building.
 * Returns the normalized distance fraction t (0..1) of first hit, or null if no hit.
 */
export function raycastBoxCollider(
  startX: number,
  startZ: number,
  endX: number,
  endZ: number,
  box: BoxCollider,
  padding = 0.4
): number | null {
  // Transform ray to local box space
  const cos = Math.cos(-box.rotation);
  const sin = Math.sin(-box.rotation);

  const lStartX = (startX - box.centerX) * cos - (startZ - box.centerZ) * sin;
  const lStartZ = (startX - box.centerX) * sin + (startZ - box.centerZ) * cos;

  const lEndX = (endX - box.centerX) * cos - (endZ - box.centerZ) * sin;
  const lEndZ = (endX - box.centerX) * sin + (endZ - box.centerZ) * cos;

  const dirX = lEndX - lStartX;
  const dirZ = lEndZ - lStartZ;

  const hx = box.halfWidth + padding;
  const hz = box.halfDepth + padding;

  // Slab method for AABB line clipping
  let tNear = 0;
  let tFar = 1;

  // X slab
  if (Math.abs(dirX) < 1e-6) {
    if (lStartX < -hx || lStartX > hx) return null;
  } else {
    let t1 = (-hx - lStartX) / dirX;
    let t2 = (hx - lStartX) / dirX;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tNear = Math.max(tNear, t1);
    tFar = Math.min(tFar, t2);
    if (tNear > tFar || tFar < 0) return null;
  }

  // Z slab
  if (Math.abs(dirZ) < 1e-6) {
    if (lStartZ < -hz || lStartZ > hz) return null;
  } else {
    let t1 = (-hz - lStartZ) / dirZ;
    let t2 = (hz - lStartZ) / dirZ;
    if (t1 > t2) {
      const tmp = t1;
      t1 = t2;
      t2 = tmp;
    }
    tNear = Math.max(tNear, t1);
    tFar = Math.min(tFar, t2);
    if (tNear > tFar || tFar < 0) return null;
  }

  return tNear >= 0 && tNear <= 1 ? tNear : null;
}

/**
 * Checks ray from player to ideal camera against all building colliders.
 * Returns safe distance multiplier (0..1) to prevent camera clipping inside buildings.
 */
export function getCameraOcclusionFraction(
  targetX: number,
  targetZ: number,
  camX: number,
  camZ: number
): number {
  let minFraction = 1.0;

  for (const box of BUILDING_COLLIDERS) {
    const hit = raycastBoxCollider(targetX, targetZ, camX, camZ, box, 0.5);
    if (hit !== null && hit < minFraction) {
      minFraction = hit;
    }
  }

  return minFraction;
}
