import React, { use, useRef } from 'react';

import { useDispatch, useSelector } from 'react-redux';

import { clientTradeDeclined, clientOfferGoldInTrade, clientOfferItemInTrade, clientTradeAccepted } from '@store/tradeWindowSlice.js';

import styles from './TradeWindow.module.css';

export default function TradeWindow() 
{
    const dispatch = useDispatch();

    const playerName = window.clientGlobalManager.clientPlayerManager.characterData.name;
    const tradePartner = useSelector(state => state.tradeWindow.tradePartner);
    const theirOfferItems = useSelector(state => state.tradeWindow.theirOfferItems);
    const yourOfferItems = useSelector(state => state.tradeWindow.yourOfferItems);
    const theirOfferGold = useSelector(state => state.tradeWindow.theirOfferGold);
    const yourOfferGold = useSelector(state => state.tradeWindow.yourOfferGold);
    const selectedItem = useSelector(state => state.inventory.selectedItem);
    const errorMessage = useSelector(state => state.tradeWindow.errorMessage);
    const successMessage = useSelector(state => state.tradeWindow.successMessage);

    const goldAmt = useRef(null);
    const itemQty = useRef(null);

    const handleClientOfferItemInTrade = () => 
    {
        if (!selectedItem) return;
        const qty = parseInt(itemQty.current.value);
        if (isNaN(qty) || qty < 0) return;
        dispatch(clientOfferItemInTrade({qty: qty, item: selectedItem}));
        itemQty.current.value = '';
    }

    const handleClientOfferGoldInTrade = () => 
    {
        const amt = parseInt(goldAmt.current.value);
        if (isNaN(amt) || amt < 0) return;
        dispatch(clientOfferGoldInTrade(amt));
        goldAmt.current.value = '';
    }

    return (
        <div className={styles.tradeWindow}>

            <div className={styles.offers}>
                {/* THEIR OFFER */}
                <div className={styles.theirOffer}>
                    <h2>{tradePartner} offers</h2>

                    {/* Only show gold if > 0 */}
                    {theirOfferGold > 0 && (
                        <div className={styles.theirGoldOffer}>
                            {theirOfferGold} gold
                        </div>
                    )}

                    {/* Only show items with qty > 0 */}
                    <div className={styles.theirItemsOffer}>
                        {Object.entries(theirOfferItems)
                            .filter(([_, qty]) => qty > 0)
                            .map(([name, qty]) => (
                                <div key={name}>{name} x{qty}</div>
                            ))}
                    </div>
                </div>

                {/* YOUR OFFER */}
                <div className={styles.yourOffer}>
                    <h2>{playerName} offers</h2>

                    {yourOfferGold > 0 && (
                        <div className={styles.yourGoldOffer}>
                            {yourOfferGold} gold
                        </div>
                    )}

                    <div className={styles.yourItemsOffer}>
                        {Object.entries(yourOfferItems)
                            .filter(([_, qty]) => qty > 0)
                            .map(([name, qty]) => (
                                <div key={name}>{name} x{qty}</div>
                            ))}
                    </div>
                </div>
            </div>

            <div className={styles.offerActions}>
                <div className={styles.offerItems}>
                    <input type="number" placeholder="Qty" ref={itemQty} />
                    <button className={styles.addItemButton} onClick={() => handleClientOfferItemInTrade()}>Set Item Quantity</button>
                </div>

                <div className={styles.offerGold}>
                    <input type="number" placeholder="Amt" ref={goldAmt} />
                    <button className={styles.addItemButton} onClick={() => handleClientOfferGoldInTrade()}>Set Gold Amount</button>
                </div>
            </div>

            <div className={styles.messages}>
                {errorMessage && (
                    <div className={styles.errorMessage}>{errorMessage}</div>
                )}
                {successMessage && (
                    <div className={styles.successMessage}>{successMessage}</div>
                )}
            </div>

            <div className={styles.tradeActions}>
                <button className={styles.acceptButton} onClick={() => dispatch(clientTradeAccepted())}>Accept</button>
                <button className={styles.declineButton} onClick={() => dispatch(clientTradeDeclined())}>Decline</button>
            </div>

        </div>
    );
}