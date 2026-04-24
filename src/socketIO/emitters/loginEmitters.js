import { clientLogin, clientRegister } from "@/store/loginSlice.js";
import { setStats } from "@/store/statsSlice.js";

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
            store.dispatch({ type: 'leftPanel/setLeftPanel', payload: 'userInterface' });
            store.dispatch({ type: 'centerPanel/setCenterPanel', payload: null });
            const stats = 
            {
                name: response.characterData.name,
                level: response.characterData.level,
                experience: response.characterData.experience,
                gold: response.characterData.gold,
                currentHp: response.characterData.currentHp,
                maxHp: response.characterData.maxHp
            }
            store.dispatch(setStats(stats));
            store.dispatch({ type: 'rightPanel/setRightPanel', payload: 'statsPanel' });
            const partyDataClone = structuredClone(window.clientGlobalManager.clientPartyManager.partyData);
            store.dispatch({ type: 'partyWindow/setPartyData', payload: partyDataClone });
            store.dispatch({ type: 'inventory/setInventory', payload: response.characterData.inventory });
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