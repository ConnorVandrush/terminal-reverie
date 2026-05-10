import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCenterPanel } from '@store/centerPanelSlice.js';

import styles from './TradeButton.module.css';

export default function TradeButton() {
    const centerPanelState = useSelector(state => state.centerPanel.centerPanel);
    const dispatch = useDispatch();

    function toggleTradeWindow() 
    {
        if (centerPanelState === 'tradeRequestWindow')
        {
            dispatch(setCenterPanel(null));
        }
        else
        {
            dispatch(setCenterPanel('tradeRequestWindow'));
        }
    }
    return (
        <button className={styles.tradeButton} onClick={toggleTradeWindow} />
    );
}