import loginEmitters from "./emitters/loginEmitters";

export const middleware = (store) => 
{
    let globalManagerInitialized = false;
    let publicNamespace;
    let initialized = false;
    return (next) => (action) =>
    {
        if (!initialized)
        {
            initialized = true;
        }

        if (window.clientGlobalManager && !globalManagerInitialized)
        {
            publicNamespace = window.clientGlobalManager.publicNamespace;
            globalManagerInitialized = true;
        }

        loginEmitters(publicNamespace, store, action);

        return next(action);
    }
}