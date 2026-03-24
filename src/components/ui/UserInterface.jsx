import React from 'react';

import styles from './UserInterface.module.css';
import MovementButton from './MovementButton';
import ConirmButton from './Confirmbutton';
import CancelButton from './CancelButton';
import ChatButton from './ChatButton';

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
                <ConirmButton />
                <CancelButton />
                <ChatButton />
            </div>
        </div>
    );
}