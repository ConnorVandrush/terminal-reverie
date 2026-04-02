import React from 'react';

import styles from './ConfirmButton.module.css';

export default function ConirmButton() 
{
    function confirm() 
    {
        Input.virtualClick('ok');
    }
    return (
        <button className={styles.confirmationButton} onClick={confirm} />
    );
}