import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRightPanel } from '@store/rightPanelSlice.js';

import styles from './InventoryButton.module.css';

export default function InventoryButton() {
    const rightPanelState = useSelector(state => state.rightPanel.rightPanel);
    const dispatch = useDispatch();

    function toggleInventoryPanel() 
    {
        if (rightPanelState === 'inventoryPanel')
        {
            dispatch(setRightPanel(null));
        }
        else
        {
            dispatch(setRightPanel('inventoryPanel'));
        }
    }
    return (
        <button className={styles.inventoryButton} onClick={toggleInventoryPanel} />
    );
}