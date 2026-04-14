import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './EnemyInfo.module.css';

export default function EnemyInfo() {
    const dispatch = useDispatch();

    const enemies = useSelector(state => state.encounter.enemyInfo);
    const currentTarget = useSelector(state => state.encounter.currentTarget);

    const handleEnemySelect = (index) => {
        const isAlreadySelected =
            currentTarget?.side === 'enemy' &&
            currentTarget?.index === index;

        if (isAlreadySelected) {
            // Deselect
            dispatch({ type: 'encounter/setCurrentTarget', payload: null });
            window.clientGlobalManager.clientEncounterManager.target = null;
        } else {
            // Select
            const payload = { index, side: 'enemy' };
            dispatch({ type: 'encounter/setCurrentTarget', payload });
            window.clientGlobalManager.clientEncounterManager.target = payload;
        }
    };

    return (
        <div className={styles.enemyList}>
            {enemies.map((enemy, index) => {
                const isSelected =
                    currentTarget?.side === 'enemy' &&
                    currentTarget?.index === index;

                return (
                    <button
                        key={index}
                        className={`${styles.enemyButton} ${isSelected ? styles.selected : ""}`}
                        onClick={() => handleEnemySelect(index)}
                    >
                        {enemy.name} {index + 1}
                    </button>
                );
            })}
        </div>
    );
}