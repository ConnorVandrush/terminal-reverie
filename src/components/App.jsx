import React from 'react';
import { useSelector } from 'react-redux';

import Login from './login/Login';
import CreateCharacter from './login/CreateCharacter';
import SpritesheetDisplay from './login/SpritesheetDisplay';
import ColorCharacter from './login/ColorCharacter';
import UserInterface from './ui/UserInterface';
import ChatWindow from './chat/ChatWindow';
import PartyWindow from './party/PartyWindow';
import Stats from './ui/stats/Stats';
import EncounterInfo from './encounter/EncounterInfo';
import EnemyInfo from './encounter/EnemyInfo';
import AllyInfo from './encounter/AllyInfo';

export default function App()
{
    const leftPanel = useSelector((state) => state.leftPanel.leftPanel);
    const renderLeftPanel = () =>
    {
        switch (leftPanel)
        {
            case 'login':
                return <Login />;
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
            case 'stats':
                return <Stats />;
            case 'allyInfo':
                return <AllyInfo />;
            default:
                return null;
        }
    };

    return (
        <div id="layout">
            <div id="leftPanel">{renderLeftPanel()}</div>
            <div id="gamePanel">
                {centerPanel && <div
                    className={[
                        "centerPanel",
                        centerPanel === "chatWindow" && "centerPanelChat", //game.css
                        centerPanel === "partyWindow" && "centerPanelParty",
                        centerPanel === "encounterInfo" && "centerPanelEncounterInfo",
                    ].filter(Boolean).join(" ")}
                    >
                    {renderCenterPanel()}
                </div>}
            </div>
            <div id="rightPanel">{renderRightPanel()}</div>
        </div>
    );
}

//CSS is in the public folder