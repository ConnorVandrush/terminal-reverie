import React from 'react';
import { useSelector } from 'react-redux';

import styles from './StatsPanel.module.css';


export default function StatsPanel()
{
    const partyData = useSelector((state) => state.partyWindow.partyData);
    const characterData = partyData.members.find(member => member.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId);

    return (
        <div className={styles.stats}>
            <div className={styles.name}>
                {characterData.name}
            </div>
            <div className={styles.level}>
                Level: {characterData.level}
            </div>
            <div className={styles.experience}>
                XP: {characterData.experience}
            </div>
            <div className={styles.gold}>
                Gold: {characterData.gold}
            </div>
            <div className={styles.health}>
                HP: {characterData.currentHp}/{characterData.maxHp}
            </div>
        </div>
    )
}