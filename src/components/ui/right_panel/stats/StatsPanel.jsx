import React from 'react';
import { useSelector } from 'react-redux';

import styles from './StatsPanel.module.css';


export default function StatsPanel()
{
    const { name, level, currentHp, maxHp, experience, gold } = useSelector((state) => state.stats);

    return (
        <div className={styles.stats}>
            <div className={styles.name}>
                {name}
            </div>
            <div className={styles.level}>
                Level: {level}
            </div>
            <div className={styles.experience}>
                XP: {experience}
            </div>
            <div className={styles.gold}>
                Gold: {gold}
            </div>
            <div className={styles.health}>
                HP: {currentHp}/{maxHp}
            </div>
        </div>
    )
}