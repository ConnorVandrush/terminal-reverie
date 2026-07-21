import { useDispatch, useSelector } from "react-redux";

import styles from "./CancelButtonComponent.module.css";

export default function CancelButtonComponent() {
  const dispatch = useDispatch();

  function cancel() {
    Input.virtualClick("cancel");
  }

  return (
    <button
      data-testid="cancel-button"
      className={styles.cancelButton}
      onClick={cancel}
    />
  );
}
