import { clientLogin, clientRegister } from "@/store/loginSlice.js";

export default async function loginEmitters(store, action)
{
    const publicNamespace = window.clientGlobalManager.publicNamespace;
    
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
            window.clientGlobalManager.initAuthenticatedSocket();
            window.clientGlobalManager.publicNamespace.disconnect();
        }
    }

    if (action.type === clientRegister.type)
    {
        console.log("Emitting clientRegister with payload:", action.payload);
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