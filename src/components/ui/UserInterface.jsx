import React from 'react';

import styles from './UserInterface.module.css';
import MovementButton from './interaction_pad/MovementButton';
import ConirmButton from './interaction_pad/ConfirmButton';
import CancelButton from './interaction_pad/CancelButton';
import ChatButton from './interaction_pad/ChatButton';
import PartyButton from './interaction_pad/PartyButton';

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
                <PartyButton />
            </div>
        </div>
    );
}