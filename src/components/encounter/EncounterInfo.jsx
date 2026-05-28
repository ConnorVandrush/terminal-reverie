import React from "react";
import { useDispatch, useSelector } from "react-redux";

import styles from "./EncounterInfo.module.css";

export default function EncounterInfo() {
  const dispatch = useDispatch();
  const encounterInfo = useSelector((state) => state.encounter.encounterInfo);
  const currentTarget = useSelector((state) => state.encounter.currentTarget);
  const encounterMessages = useSelector(
    (state) => state.encounter.encounterMessages,
  );

  function attack() {
    if (!currentTarget) {
      alert("Please select a target before attacking.");
      return;
    }
    window.clientGlobalManager.clientEncounterManager.hideSelectionArrow();
    dispatch({
      type: "encounter/setEncounterInfo",
      payload: "encounterMessage",
    });
    dispatch({
      type: "encounter/clientAllyTurn",
      payload: { actionType: "attack", target: currentTarget },
    });
  }

  function defend() {
    window.clientGlobalManager.clientEncounterManager.hideSelectionArrow();
    dispatch({
      type: "encounter/setEncounterInfo",
      payload: "encounterMessage",
    });
    dispatch({
      type: "encounter/clientAllyTurn",
      payload: { actionType: "defend" },
    });
  }

  function renderBattleWindow() {
    switch (encounterInfo) {
      case "commandSelection":
        return (
          <div className={styles.encounterCommand}>
            <button className={styles.commandButton} onClick={attack}>
              Attack
            </button>
            <button className={styles.commandButton} onClick={defend}>
              Defend
            </button>
            <button className={styles.commandButton}>Item</button>
            <button className={styles.commandButton}>Run</button>
          </div>
        );
      case "encounterMessage":
        return (
          <div className={styles.encounterMessages}>
            {encounterMessages.map((message, index) => (
              <p key={index}>{message}</p>
            ))}
          </div>
        );
      case "gameOver":
        return (
          <div className={styles.gameOverWindow}>
            <p>
              {
                window.clientGlobalManager.clientPlayerManager.characterData
                  .name
              }{" "}
              Has Been Vanquished
              <br />
              Return to the login screen and login again to create a new
              character.
            </p>
            <button
              className={styles.returnToLoginButton}
              onClick={() => {
                window.location.reload(true);
              }}
            >
              Return to Login Screen
            </button>
          </div>
        );
      default:
        return <div>No encounter window available.</div>;
    }
  }

  return renderBattleWindow();
}
