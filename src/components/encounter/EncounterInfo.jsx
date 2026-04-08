import React from 'react';
import { useDispatch, useSelector } from 'react-redux';

import styles from './EncounterInfo.module.css';

export default function EncounterInfo() {
    const dispatch = useDispatch();
    const encounterInfo = useSelector(state => state.encounter.encounterInfo);

    //const allyTarget = useSelector(state => state.battleCommandWindow.allyTarget);
    //const enemyTarget = useSelector(state => state.battleCommandWindow.enemyTarget);

    function attack()
    {
    }

    function renderBattleWindow() 
    {
        switch (encounterInfo)
        {
            case 'commandSelection':
                return (
                    <div className={styles.encounterCommand}>
                        <button className={styles.commandButton} onClick={attack}>Attack</button>
                        <button className={styles.commandButton}>Defend</button>
                        <button className={styles.commandButton}>Item</button>
                        <button className={styles.commandButton}>Run</button>
                    </div>
                );
            case 'encounterReadout':
                return (
                    <div className={styles.encounterBattleReadout}>
                    </div>
                );
            case 'gameOver':
                return (
                    <div className={styles.gameOver}>
                        <h1>{globalThis.playerData.characterData.name} Has Been Vanquished</h1>
                        <p>Return to the login screen and login again to create a new character.</p>
                        <button className={styles.returnToLoginButton} onClick={() => {
                            window.location.reload(true);
                        }}>Return to Login Screen</button>
                    </div>
                );
            default:
                return <div>No encounter window available.</div>;
        }
    }

    return (
        renderBattleWindow()
    );
}