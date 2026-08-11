import {
  clientLogin,
  clientRegister,
  setErrorMessage,
  setSuccessMessage,
} from "@store/login/LoginSlice.js";

import {
  setPartyMemberCharacterData,
  setPartyLeaderCharacterId,
} from "@store/party/PartySlice.js";

export default async function LoginSliceEmitters(store, action) {
  try {
    if (action.type === clientLogin.type) {
      const { success, error, JWT, characterData } =
        await window.clientAPI.loginNamespace.emitWithAck(
          "clientLogin",
          action.payload,
        );
      if (error) {
        store.dispatch(setErrorMessage(error));
      }
      if (success) {
        store.dispatch(
          setPartyMemberCharacterData({
            memberIndex: 0,
            characterData: characterData,
          }),
        );
        store.dispatch(setPartyLeaderCharacterId(characterData.characterId));
        localStorage.setItem("JWT", JWT);
        window.clientAPI.loginNamespace.disconnect();
        window.clientAPI.playerManager.login(characterData);
        window.clientAPI.playerManager.playerCharacterId =
          characterData.characterId;
      }
    }
    if (action.type === clientRegister.type) {
      const { success, error } =
        await window.clientAPI.loginNamespace.emitWithAck(
          "clientRegister",
          action.payload,
        );
      if (error) {
        store.dispatch(setErrorMessage(error));
      }
      if (success) {
        store.dispatch(setSuccessMessage(success));
      }
    }
  } catch (error) {
    console.error("LoginSliceEmitters:", error);
    store.dispatch(setErrorMessage("Unexpected error occurred."));
  }
}
