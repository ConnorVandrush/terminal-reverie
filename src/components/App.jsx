import React from 'react';
import { useSelector } from 'react-redux';

import Login from './login/Login';
import CreateCharacter from './login/CreateCharacter';
import SpritesheetDisplay from './login/SpritesheetDisplay';
import ColorCharacter from './login/ColorCharacter';
import UserInterface from './ui/UserInterface';

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
            default:
                return null;
        }
    };

    return (
        <div id="layout">
            <div id="leftPanel">{renderLeftPanel()}</div>
            <div id="gamePanel">
                {centerPanel && <div id="centerPanel">{renderCenterPanel()}</div>}
            </div>
            <div id="rightPanel">{renderRightPanel()}</div>
        </div>
    );
}

//CSS is in the public folder