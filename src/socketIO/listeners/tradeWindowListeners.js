import {
  serverSendTradeRequest,
  serverTradeRequestAccepted,
} from "@store/tradeWindowSlice";

export function createTradeWindowListeners(store) {
  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverSendTradeRequest",
    (data) => {
      store.dispatch(serverSendTradeRequest(data));
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverTradeRequestAccepted",
    (data) => {
      window.clientGlobalManager.clientMapManager.isMoving = true;
      store.dispatch({
        type: "centerPanel/setCenterPanel",
        payload: "tradeWindow",
      });
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
      store.dispatch(serverTradeRequestAccepted(data));
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverTradeDeclined",
    (data) => {
      store.dispatch({ type: "centerPanel/setCenterPanel", payload: null });
      store.dispatch({ type: "tradeWindow/setTradePartner", payload: null });
      store.dispatch({ type: "tradeWindow/setTheirOffer", payload: [] });
      store.dispatch({ type: "tradeWindow/setYourOffer", payload: [] });
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
      window.clientGlobalManager.clientMapManager.isMoving = false;
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverUpdateTheirOfferGold",
    (data) => {
      store.dispatch({
        type: "tradeWindow/setTheirOfferGold",
        payload: data.amt,
      });
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverUpdateTheirOfferItems",
    (data) => {
      store.dispatch({ type: "tradeWindow/setTheirOfferItems", payload: data });
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverTradePartnerAcceptedTrade",
    (data) => {
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
      store.dispatch({
        type: "tradeWindow/setSuccessMessage",
        payload: data.message,
      });
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverTradeError",
    (data) => {
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({
        type: "tradeWindow/setErrorMessage",
        payload: data.message,
      });
    },
  );

  window.clientGlobalManager.clientPlayerManager.socket.on(
    "serverTradeComplete",
    (data) => {
      window.clientGlobalManager.clientPlayerManager.updatePlayerCharacterData(
        data.characterData,
      );
      store.dispatch({ type: "centerPanel/setCenterPanel", payload: null });
      store.dispatch({ type: "tradeWindow/setTradePartner", payload: null });
      store.dispatch({ type: "tradeWindow/setTheirOffer", payload: [] });
      store.dispatch({ type: "tradeWindow/setYourOffer", payload: [] });
      store.dispatch({ type: "tradeWindow/setSuccessMessage", payload: null });
      store.dispatch({ type: "tradeWindow/setErrorMessage", payload: null });
      window.clientGlobalManager.clientMapManager.isMoving = false;
    },
  );
}
