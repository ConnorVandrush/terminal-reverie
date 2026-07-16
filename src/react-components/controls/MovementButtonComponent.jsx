import React, { useState, useEffect } from "react";

import styles from "./MovementButtonComponent.module.css";

export default function MovementButtonComponent({ direction }) {
  const [pressed, setPressed] = useState(false);

  // This effect runs a loop while the button is held
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
      className={`${styles.arrow} ${styles[`arrow${direction}`]} ${pressed ? styles.pressed : ""}`}
      onTouchStart={() => setPressed(true)}
      onTouchEnd={() => setPressed(false)}
      onTouchCancel={() => setPressed(false)}
      onMouseDown={() => setPressed(true)}
      onMouseUp={() => setPressed(false)}
      onMouseLeave={() => setPressed(false)}
    />
  );
}
