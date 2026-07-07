import { setLeftPanel } from "@store/ui/LeftPanelSlice";
import { setCenterPanel } from "@store/ui/CenterPanelSlice";
import { setRightPanel } from "@store/ui/RightPanelSlice";

export default async function LoginSliceListeners(store) {
  window.clientAPI.loginNamespace.on(
    "serverCreateCharacter",
    async (data, cb) => {
      {
        store.dispatch(setLeftPanel("CreateCharacterComponent"));
        store.dispatch(setCenterPanel("SpritesheetDisplayComponent"));
        store.dispatch(setRightPanel("ColorCharacterComponent"));
      }
    },
  );
}
