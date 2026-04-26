import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCenterPanel } from '@store/centerPanelSlice.js';

import styles from './PartyButton.module.css';

export default function InviteToPartyButton() {
    const dispatch = useDispatch();
    const centerPanelState = useSelector(state => state.centerPanel.centerPanel);

    function toggleInviteToParty() 
    {
        if (centerPanelState === 'partyWindow')
        {
            dispatch(setCenterPanel(null));
            dispatch({ type: 'inventory/setSelectedItem', payload: null });
        }
        else
        {
            dispatch(setCenterPanel('partyWindow'));
        }
    }
    
    return (
        <button className={styles.chatButton} onClick={toggleInviteToParty} />
    );
}