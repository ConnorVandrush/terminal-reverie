import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setRightPanel } from '@store/rightPanelSlice.js';

import styles from './StatsButton.module.css';

export default function StatsButton() {
    const rightPanelState = useSelector(state => state.rightPanel.rightPanel);
    const dispatch = useDispatch();

    function toggleStatsPanel() 
    {
        if (rightPanelState === 'statsPanel')
        {
            dispatch(setRightPanel(null));
        }
        else
        {
            dispatch(setRightPanel('statsPanel'));
        }
    }
    return (
        <button className={styles.statsButton} onClick={toggleStatsPanel} />
    );
}