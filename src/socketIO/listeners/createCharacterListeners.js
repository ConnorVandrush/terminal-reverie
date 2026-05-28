import { setLeftPanel } from "@store/leftPanelSlice";
import { setCenterPanel } from "@store/centerPanelSlice";
import { setRightPanel } from "@store/rightPanelSlice";
import { setCreateCharacterCB } from "@store/createCharacterSlice";

export function createCharacterListeners(store) {
  window.clientGlobalManager.clientPlayerManager.publicNamespace.on(
    "serverCreateCharacter",
    async (data, cb) => {
      {
        store.dispatch(setLeftPanel("createCharacter"));
        store.dispatch(setCenterPanel("spritesheetDisplay"));
        store.dispatch(setRightPanel("colorCharacter"));
        store.dispatch(setCreateCharacterCB(cb)); // Store the callback for later use when the character creation process is complete
      }
    },
  );
}
