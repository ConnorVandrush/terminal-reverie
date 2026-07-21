import React from "react";
import { useSelector, useDispatch } from "react-redux";

import styles from "./ConfirmButtonComponent.module.css";

export default function ConirmButtonComponent() {
  const dispatch = useDispatch();
  function confirm() {
    Input.virtualClick("ok");
  }
  return <button className={styles.confirmationButton} onClick={confirm} />;
}
