import { useEffect, useState } from "react";

export interface KeyControls {
  forward: boolean;
  backward: boolean;
  left: boolean;
  right: boolean;
  sprint: boolean;
  jump: boolean;
}

export function useKeyboard(): KeyControls {
  const [keys, setKeys] = useState<KeyControls>({
    forward: false,
    backward: false,
    left: false,
    right: false,
    sprint: false,
    jump: false,
  });

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Avoid intercepting if user is typing in an input
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }

      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((prev) => ({ ...prev, forward: true }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((prev) => ({ ...prev, backward: true }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((prev) => ({ ...prev, left: true }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((prev) => ({ ...prev, right: true }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setKeys((prev) => ({ ...prev, sprint: true }));
          break;
        case "Space":
          setKeys((prev) => ({ ...prev, jump: true }));
          break;
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      switch (e.code) {
        case "KeyW":
        case "ArrowUp":
          setKeys((prev) => ({ ...prev, forward: false }));
          break;
        case "KeyS":
        case "ArrowDown":
          setKeys((prev) => ({ ...prev, backward: false }));
          break;
        case "KeyA":
        case "ArrowLeft":
          setKeys((prev) => ({ ...prev, left: false }));
          break;
        case "KeyD":
        case "ArrowRight":
          setKeys((prev) => ({ ...prev, right: false }));
          break;
        case "ShiftLeft":
        case "ShiftRight":
          setKeys((prev) => ({ ...prev, sprint: false }));
          break;
        case "Space":
          setKeys((prev) => ({ ...prev, jump: false }));
          break;
      }
    };

    const handleBlur = () => {
      setKeys({
        forward: false,
        backward: false,
        left: false,
        right: false,
        sprint: false,
        jump: false,
      });
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
    };
  }, []);

  return keys;
}
