import styles from "./ControlsComponent.module.css";

import MovementButtonComponent from "./MovementButtonComponent";

export default function ControlsComponent() {
  return (
    <div className={styles.controlsComponentStyle}>
      <MovementButtonComponent direction="Up" />
      <MovementButtonComponent direction="Left" />
      <MovementButtonComponent direction="Right" />
      <MovementButtonComponent direction="Down" />
    </div>
  );
}
