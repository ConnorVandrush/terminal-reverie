import React from 'react';

import styles from './CancelButton.module.css';

export default function CancelButton() 
{
    function cancel() 
    {
        Input.virtualClick('cancel');
    }
    return (
        <button className={styles.cancelButton} onClick={cancel} />
    );
}