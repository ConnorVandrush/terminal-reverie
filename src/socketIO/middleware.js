import loginEmitters from "./emitters/loginEmitters";
import chatWindowEmitters from "./emitters/chatWindowEmitters";
import partyWindowEmitters from "./emitters/partyWindowEmitters";
import encounterEmitters from "./emitters/encounterEmitters";
import inventoryEmitters  from "./emitters/inventoryEmitter";
import shopWindowEmitters from "./emitters/shopWindowEmitters";

import { createCharacterListeners } from "./listeners/createCharacterListeners";
import { createChatWindowListeners } from "./listeners/chatWindowListeners";
import { createPartyWindowListeners } from "./listeners/partyWindowListeners";

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
            window.clientGlobalManager.dispatchToReact = store.dispatch;
            createChatWindowListeners(store);
            createPartyWindowListeners(store);
        }

        loginEmitters(store, action);
        chatWindowEmitters(action);
        partyWindowEmitters(action, store);
        encounterEmitters(action);
        inventoryEmitters(action, store);
        shopWindowEmitters(action, store);

        return next(action);
    }
}