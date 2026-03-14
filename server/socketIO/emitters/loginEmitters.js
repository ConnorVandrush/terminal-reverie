import { clientLogin, clientRegister } from "@/store/loginSlice.js";

export default async function loginEmitters(publicNamespace, store, action)
{
    if (action.type === clientLogin.type)
    {
        console.log("Emitting clientLogin with payload:", action.payload);
        const response = await publicNamespace.emitWithAck('clientLogin', action.payload);
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