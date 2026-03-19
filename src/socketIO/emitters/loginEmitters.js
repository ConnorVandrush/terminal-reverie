import { clientLogin, clientRegister } from "@/store/loginSlice.js";

export default async function loginEmitters(store, action)
{
    const publicNamespace = window.clientGlobalManager.clientPlayerManager.publicNamespace;
    
    if (action.type === clientLogin.type)
    {
        const response = await publicNamespace.emitWithAck('clientLogin', action.payload);

        if (response.error)
        {
            store.dispatch({ type: 'login/setErrorMessage', payload: response.error });
            store.dispatch({ type: 'login/setSuccessMessage', payload: false });
        }
        else if (response.success)
        {
            const { JWT } = response;
            localStorage.setItem('JWT', JWT);
            window.clientGlobalManager.clientPlayerManager.login(response.characterData, response.mapData, response.playersOnMap);
            window.clientGlobalManager.clientPlayerManager.publicNamespace.disconnect();
            store.dispatch({ type: 'leftPanel/setLeftPanel', payload: null });
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: null });
            store.dispatch({ type: 'rightPanel/setRightPanel', payload: null });
        }
    }

    if (action.type === clientRegister.type)
    {
        const response = await publicNamespace.emitWithAck('clientRegister', action.payload);

        if (response.error)
        {
            store.dispatch({ type: 'login/setErrorMessage', payload: response.error });
            store.dispatch({ type: 'login/setSuccessMessage', payload: false });
        }
        else if (response.success)
        {
            store.dispatch({ type: 'login/setSuccessMessage', payload: response.message });
            store.dispatch({ type: 'login/setErrorMessage', payload: false });
        }
    }
}