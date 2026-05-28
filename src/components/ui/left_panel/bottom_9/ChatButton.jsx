import React from "react";
import { useDispatch, useSelector } from "react-redux";
import { setCenterPanel } from "@store/centerPanelSlice.js";

import styles from "./ChatButton.module.css";

export default function ChatButton() {
  const centerPanelState = useSelector(
    (state) => state.centerPanel.centerPanel,
  );
  const dispatch = useDispatch();

  function toggleChatWindow() {
    if (centerPanelState === "chatWindow") {
      dispatch(setCenterPanel(null));
    } else {
      dispatch(setCenterPanel("chatWindow"));
    }
  }
  return <button className={styles.chatButton} onClick={toggleChatWindow} />;
}
