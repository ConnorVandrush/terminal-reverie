import { setLeftPanel } from "@store/leftPanelSlice";
import { setCenterPanel } from "@store/centerPanelSlice";
import { setRightPanel } from "@store/rightPanelSlice";

export function createCharacterListeners(store)
{
    window.clientGlobalManager.publicNamespace.on('serverCreateCharacter', async (data, cb) =>
    {
        {
            store.dispatch(setLeftPanel('createCharacter'));
            store.dispatch(setCenterPanel('spritesheetDisplay'));
            store.dispatch(setRightPanel('colorCharacter'));
        }
    });
}
