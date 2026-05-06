import React, { use } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { clientRequestCloseShop, setSelectedShopItem, clientBuyItem } from '@store/shopWindowSlice.js';
import styles from './ShopWindow.module.css';

export default function ShopWindow() 
{
    const dispatch = useDispatch();

    const shopInventory = useSelector((state) => state.shopWindow.shopInventory);
    const selectedShopItem = useSelector((state) => state.shopWindow.selectedShopItem);
    const characterData = useSelector((state) => state.partyWindow.partyData.members.find(member => member.playerId === window.clientGlobalManager.clientPlayerManager.characterData.playerId));
    const message = useSelector((state) => state.shopWindow.message);

    const handleShopItemSelect = (itemId) => 
    {
        // Toggle logic: if already selected, deselect
        if (selectedShopItem === itemId) {
            dispatch(setSelectedShopItem(null));
        } else {
            dispatch(setSelectedShopItem(itemId));
        }
    };

    return (
        <div className={styles.shopWindow}>
            <div className={styles.shopHeader}>
                <h2 className={styles.shopTitle}>Shop</h2>
                <div className={styles.characterGold}>
                    Gold: {characterData.gold}
                </div>
            </div>

            <div className={styles.shopItems}>
                {shopInventory && Object.keys(shopInventory).length > 0 ? (
                    Object.entries(shopInventory).map(([itemId, itemData]) => (
                        <button 
                            key={itemId} 
                            className={`${styles.shopItemButton} ${
                                selectedShopItem === itemId ? styles.selectedShopItem : ""
                            }`}
                            onClick={() => handleShopItemSelect(itemId)}
                        >
                            <div className={styles.itemHeader}>
                                <div className={styles.itemName}>{itemData.name}</div>
                                <div className={styles.itemPrice}>{itemData.cost} gold</div>
                            </div>
                            <div className={styles.itemDescription}>{itemData.description}</div>
                        </button>
                    ))
                ) : (
                    <div className={styles.noItems}>No items available</div>
                )}
            </div>

            <div className={styles.messageContainer}>
                {message && <div className={styles.message}>{message}</div>}
            </div>

            <div className={styles.buttonContainer}>
                <div className={styles.buyButtonContainer}>
                    <button 
                        className={styles.buyButton}
                        disabled={!selectedShopItem}   // optional: disable until selected
                        onClick={() => dispatch(clientBuyItem({ itemId: selectedShopItem, quantity: 1 }))}  // assuming quantity of 1 for simplicity
                    >
                        Buy
                    </button>
                </div>

                <div className={styles.closeButtonContainer}>
                    <button 
                        className={styles.closeButton} 
                        onClick={() => dispatch(clientRequestCloseShop())}
                    >
                        Close Shop
                    </button>
                </div>
            </div>
        </div>
    );
}
