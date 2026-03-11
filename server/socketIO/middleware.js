export const middleware = (store) => 
{
    let initialized = false;

    return (next) => (action) =>
    {
        if (!initializedLoginNamespace)
        {
            initialized = true;
        }

        return next(action);
    }
}