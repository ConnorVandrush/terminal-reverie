import loginEmitters from "./emitters/loginEmitters";

import { createCharacterListeners } from "./listeners/createCharacterListeners";

export const middleware = (store) => 
{
    let globalManagerInitialized = false;
    let initialized = false;
    return (next) => (action) =>
    {
        if (!initialized)
        {
            initialized = true;
            createCharacterListeners(store);
        }

        if (window.clientGlobalManager && !globalManagerInitialized)
        {
            globalManagerInitialized = true;
        }

        loginEmitters(store, action);

        return next(action);
    }
}