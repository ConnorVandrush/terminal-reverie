import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCenterPanel } from '@store/centerPanelSlice.js';
import { setSelectedPartyMember } from '@store/partyWindowSlice.js';
import { setSelectedItem } from '@store/inventorySlice.js';

import styles from './CancelButton.module.css';

export default function CancelButton() 
{
    const dispatch = useDispatch();
    const centerPanel = useSelector(state => state.centerPanel.centerPanel);

    function cancel() 
    {
        // Always send the virtual cancel click
        Input.virtualClick('cancel');

        // If a center panel is open AND it's not the shop window → close it
        if (centerPanel !== null && centerPanel !== 'shopWindow') {
            dispatch(setCenterPanel(null));
            dispatch(setSelectedPartyMember(null));
            dispatch(setSelectedItem(null));
        }
    }

    return (
        <button className={styles.cancelButton} onClick={cancel} />
    );
}
