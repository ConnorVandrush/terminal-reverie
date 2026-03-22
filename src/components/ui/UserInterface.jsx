import React from 'react';

import styles from './UserInterface.module.css';
import MovementButton from './MovementButton';

export default function UserInterface()
{
    return (
        <div className={styles.userInterface}>
            <div className={styles.character}>

            </div>

            <div className={styles.interaction}>
                <MovementButton direction="Up" />
                <MovementButton direction="Down" />
                <MovementButton direction="Left" />
                <MovementButton direction="Right" />
            </div>
        </div>
    );
}