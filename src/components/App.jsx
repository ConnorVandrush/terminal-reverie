import React from 'react';
import { useSelector } from 'react-redux';

import LoginPanel from './ui/left_panel/login/LoginPanel';
import CreateCharacter from './ui/left_panel/login/CreateCharacter';
import SpritesheetDisplay from './ui/left_panel/login/SpritesheetDisplay';
import ColorCharacter from './ui/left_panel/login/ColorCharacter';
import UserInterface from './ui/UserInterface';
import ChatWindow from './ui/center_panel/chat/ChatWindow';
import PartyWindow from './ui/center_panel/party/PartyWindow';
import StatsPanel from './ui/right_panel/stats/StatsPanel';
import EncounterInfo from './encounter/EncounterInfo';
import EnemyInfo from './encounter/EnemyInfo';
import AllyInfo from './encounter/AllyInfo';
import TradeWindow from './ui/center_panel/trade/TradeWindow'; 
import InventoryPanel from './ui/right_panel/inventory/InventoryPanel';
import ShopWindow from './ui/center_panel/shop/ShopWindow';
import PartyInvites from './ui/center_panel/party/PartyInvites';

export default function App()
{
    const leftPanel = useSelector((state) => state.leftPanel.leftPanel);
    const renderLeftPanel = () =>
    {
        switch (leftPanel)
        {
            case 'login':
                return <LoginPanel />;
            case 'createCharacter':
                return <CreateCharacter />;
            case 'userInterface':
                return <UserInterface />;
            case 'enemyInfo':
                return <EnemyInfo />;
            default:
                return null;
        }
    };

    const centerPanel = useSelector((state) => state.centerPanel.centerPanel);
    const renderCenterPanel = () =>
    {
        switch (centerPanel)
        {
            case 'spritesheetDisplay':
                return <SpritesheetDisplay />;
            case 'chatWindow':
                return <ChatWindow />;
            case 'partyWindow':
                return <PartyWindow />;
            case 'encounterInfo':
                return <EncounterInfo />;
            case 'tradeWindow':
                return <TradeWindow />;
            case 'shopWindow':
                return <ShopWindow />;
            case 'partyInvites':
                return <PartyInvites />;
            default:
                return null;
        }
    };

    const rightPanel = useSelector((state) => state.rightPanel.rightPanel);
    const renderRightPanel = () =>
    {        
        switch (rightPanel)
        {
            case 'colorCharacter':
                return <ColorCharacter />;
            case 'statsPanel':
                return <StatsPanel />;
            case 'allyInfo':
                return <AllyInfo />;
            case 'inventoryPanel':
                return <InventoryPanel />;
            default:
                return null;
        }
    };

    return (
        <div id="layout">
            <div id="leftPanel">{renderLeftPanel()}</div>
            <div id="gamePanel">
                {centerPanel && <div
                    className={`centerPanel ${
                        centerPanel === "chatWindow" ? "centerPanelChat" :
                        centerPanel === "partyWindow" ? "centerPanelParty" :
                        centerPanel === "encounterInfo" ? "centerPanelEncounterInfo" :
                        centerPanel === "shopWindow" ? "centerPanelShop" :
                        centerPanel === "partyInvites" ? "centerPanelPartyInvites" :
                        ""
                    }`}
                >
                    {renderCenterPanel()}
                </div>}
            </div>
            <div id="rightPanel">{renderRightPanel()}</div>
        </div>
    );
}

//CSS is in the public folder