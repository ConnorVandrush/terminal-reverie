import { useEffect, useRef } from "react";
import { useSelector } from "react-redux";

import styles from "./EncounterMessageComponent.module.css";

export default function EncounterMessageComponent() {
  const messagesEndRef = useRef();

  const encounterMessages = useSelector(
    (state) => state.EncounterSlice.encounterMessages,
  );

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [encounterMessages]);

  return (
    <div className={styles.encounterMessages}>
      <div className={styles.messagesContainer}>
        <div style={{ marginTop: "auto" }} />

        {encounterMessages.map((message, index) => (
          <p key={index}>{message}</p>
        ))}

        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
