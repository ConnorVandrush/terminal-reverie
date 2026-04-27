import React from 'react';
import { useSelector, useDispatch } from 'react-redux';

import styles from './ConfirmButton.module.css';

export default function ConirmButton() 
{
    const dispatch = useDispatch();

    const selectedItem = useSelector((state) => state.inventory.selectedItem);
    const selectedPartyMemberIndex = useSelector((state) => state.partyWindow.selectedPartyMember);

    function confirm() 
    {
        if (selectedItem !== null && selectedPartyMemberIndex !== null)
        {
            const selectedPartyMemberId = window.clientGlobalManager.clientPartyManager.partyData.members[selectedPartyMemberIndex].playerId;
            dispatch({ type: 'inventory/clientUseItem', payload: { selectedItem, selectedPartyMemberId } });
        }
        else
        {
            Input.virtualClick('ok');
        }
    }
    return (
        <button className={styles.confirmationButton} onClick={confirm} />
    );
}