import loginEmitters from "./emitters/loginEmitters";
import chatWindowEmitters from "./emitters/chatWindowEmitters";
import partyWindowEmitters from "./emitters/partyWindowEmitters";

import { createCharacterListeners } from "./listeners/createCharacterListeners";
import { createChatWindowListeners } from "./listeners/chatWindowListeners";

export const middleware = (store) => 
{
    let initialized = false;
    let authenticated = false;
    return (next) => (action) =>
    {
        if (!initialized)
        {
            initialized = true;
            createCharacterListeners(store);
        }
        if (!authenticated && window.clientGlobalManager.clientPlayerManager.socket)
        {
            authenticated = true;
            createChatWindowListeners(store);
        }

        loginEmitters(store, action);
        chatWindowEmitters(action);
        partyWindowEmitters(action);

        return next(action);
    }
}