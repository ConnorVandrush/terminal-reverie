import React from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { clientTradeDeclined } from '@store/tradeWindowSlice.js';

import styles from './TradeWindow.module.css';

export default function TradeWindow() 
{
    const dispatch = useDispatch();

    const playerName = window.clientGlobalManager.clientPlayerManager.characterData.name;
    const tradePartner = useSelector(state => state.tradeWindow.tradePartner);
    const theirOffer = useSelector(state => state.tradeWindow.theirOffer);
    const yourOffer = useSelector(state => state.tradeWindow.yourOffer);

    return (
        <div className={styles.tradeWindow}>

            <div className={styles.offers}>

                <div className={styles.theirOffer}>
                    <h2>{tradePartner} offers</h2>
                </div>

                <div className={styles.yourOffer}>
                    <h2>{playerName} offers</h2>
                </div>

            </div>

            <div className={styles.offerActions}>

                <div className={styles.offerItems}>
                    <input type="number" placeholder="Qty" />
                    <button className={styles.addItemButton}>Add Item</button>
                </div>

                <div className={styles.offerGold}>
                    <input type="number" placeholder="Amt" />
                    <button className={styles.addItemButton}>Add Gold</button>
                </div>

            </div>

            <div className={styles.tradeActions}>

                <button className={styles.acceptButton}>Accept</button>
                <button className={styles.declineButton} onClick={() => dispatch(clientTradeDeclined(tradePartner))}>Decline</button>

            </div>

        </div>
    );
}