import React, { useState, useEffect } from "react";
import styles from "./MovementButtonComponent.module.css";

export default function MovementButtonComponent({ direction }) {
  const [pressed, setPressed] = useState(false);

  // WASD → direction mapping
  const keyMap = {
    Up: "w",
    Down: "s",
    Left: "a",
    Right: "d",
  };

  // Keyboard → pressed state
  useEffect(() => {
    const handleKeyDown = (e) => {
      // 🔒 If typing in an input, disable movement
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        return;
      }

      if (e.key.toLowerCase() === keyMap[direction]) {
        setPressed(true);
      }
    };

    const handleKeyUp = (e) => {
      const active = document.activeElement;
      if (
        active &&
        (active.tagName === "INPUT" ||
          active.tagName === "TEXTAREA" ||
          active.isContentEditable)
      ) {
        return;
      }

      if (e.key.toLowerCase() === keyMap[direction]) {
        setPressed(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [direction]);

  // Movement loop
  useEffect(() => {
    let frame;

    const loop = () => {
      if (
        pressed &&
        !$gamePlayer.isMoving() &&
        window.clientAPI.playerManager.characterCanMove
      ) {
        const dirMap = {
          Up: 8,
          Down: 2,
          Left: 4,
          Right: 6,
        };

        $gamePlayer.moveByInput(dirMap[direction]);
      }

      if (pressed) frame = requestAnimationFrame(loop);
    };

    if (pressed) frame = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame);
  }, [pressed, direction]);

  return (
    <button
      data-testid={`move-${direction.toLowerCase()}`}
      className={`${styles.arrow} ${styles[`arrow${direction}`]} ${
        pressed ? styles.pressed : ""
      }`}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    />
  );
}
