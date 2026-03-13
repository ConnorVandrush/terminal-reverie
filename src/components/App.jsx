import React from 'react';
import { useSelector } from 'react-redux';

import Login from './Login';

export default function App()
{
    const leftPanel = useSelector((state) => state.leftPanel.leftPanel);
    const renderLeftPanel = () =>
    {
        switch (leftPanel)
        {
            case 'login':
                return <Login />;
            default:
                return null;
        }
    };
    return (
        <div id="layout">
            <div id="leftPanel">{renderLeftPanel()}</div>
            <div id="gamePanel"></div>
            <div id="rightPanel"></div>
        </div>
    );
}

//CSS is in the public folder