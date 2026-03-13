import { clientLogin } from "@/store/loginSlice.js";

export default async function loginEmitters(publicNamespace, store, action)
{
    if (action.type === clientLogin.type)
    {
        console.log("Emitting clientLogin with payload:", action.payload);
        const response = await publicNamespace.emitWithAck('clientLogin', action.payload);
    }
}