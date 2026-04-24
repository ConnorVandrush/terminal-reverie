import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import styles from './InventoryPanel.module.css';

export default function InventoryPanel() 
{
    const dispatch = useDispatch();

    const inventory = useSelector((state) => state.inventory.inventory);
    const selectedItem = useSelector((state) => state.inventory.selectedItem);

    const entries = Object.entries(inventory);

    const handleItemSelect = (id, item) => 
    {
        const isAlreadySelected = selectedItem?.id === id;

        if (isAlreadySelected) 
        {
            dispatch({ type: 'inventory/clearSelectedItem' });
        } 
        else 
        {
            dispatch({ type: 'inventory/setSelectedItem', payload: { id, item } });
        }
    };

    return (
        <div className={styles.inventory}>
            <h3>Inventory</h3>

            <ul className={styles.itemList}>
                {entries.map(([id, item]) => {
                    const isSelected = selectedItem?.id === Number(id);

                    return (
                        <button
                            key={id}
                            className={`${styles.itemButton} ${isSelected ? styles.selected : ""}`}
                            onClick={() => handleItemSelect(Number(id), item)}
                        >
                            {item.name} x{item.quantity}
                        </button>
                    );
                })}
            </ul>
        </div>
    );
}
