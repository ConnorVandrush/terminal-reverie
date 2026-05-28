import React, { useRef } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
  clientSendTradeRequest,
  clientAcceptTradeRequest,
  removeTradeRequest,
} from "@store/tradeWindowSlice.js";

import { setCenterPanel } from "@store/centerPanelSlice.js";

import styles from "./TradeRequestWindow.module.css";

export default function TradeRequestWindow() {
  const dispatch = useDispatch();

  const tradeRequests = useSelector(
    (state) => state.tradeWindow.tradeRequests || [],
  );
  const errorMessage = useSelector(
    (state) => state.tradeWindow.errorMessage || null,
  );
  const successMessage = useSelector(
    (state) => state.tradeWindow.successMessage || null,
  );

  const requestedPlayerRef = useRef(null);

  const handleSendTradeRequest = () => {
    const requestedPlayer = requestedPlayerRef.current?.value?.trim();
    if (!requestedPlayer) return;

    dispatch(clientSendTradeRequest(requestedPlayer));
    requestedPlayerRef.current.value = "";
  };

  const handleAcceptTradeRequest = (fromPlayerName) => {
    if (!fromPlayerName) return;

    dispatch(clientAcceptTradeRequest(fromPlayerName));
    dispatch(removeTradeRequest(fromPlayerName));
  };

  return (
    <div className={styles.tradeRequestsWindow}>
      {/* Input Row */}
      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Enter player name to trade with"
          ref={requestedPlayerRef}
          className={styles.inviteInput}
        />

        <button
          className={styles.sendTradeRequestButton}
          onClick={handleSendTradeRequest}
        >
          Send Trade Request
        </button>
      </div>

      {/* Messages */}
      <div className={styles.message}>
        {errorMessage && (
          <div className={styles.tradeRequestMessage}>
            <div className={styles.errorMessage}>{errorMessage}</div>
          </div>
        )}

        {successMessage && (
          <div className={styles.tradeRequestMessage}>
            <div className={styles.successMessage}>{successMessage}</div>
          </div>
        )}
      </div>

      {/* Request List */}
      <div className={styles.tradeRequestsList}>
        <h3 className={styles.tradeRequestsTitle}>Trade Requests</h3>

        {tradeRequests.length > 0 ? (
          tradeRequests.map((request) => (
            <div key={request.fromPlayerName} className={styles.invite}>
              <span className={styles.inviteText}>
                {request.fromPlayerName} has sent you a trade request.
              </span>

              <button
                className={styles.acceptButton}
                onClick={() => handleAcceptTradeRequest(request.fromPlayerName)}
              >
                Accept
              </button>

              <button
                className={styles.declineButton}
                onClick={() =>
                  dispatch(removeTradeRequest(request.fromPlayerName))
                }
              >
                Decline
              </button>
            </div>
          ))
        ) : (
          <div className={styles.noInvites}>No trade requests</div>
        )}
      </div>
    </div>
  );
}
