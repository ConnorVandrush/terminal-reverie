import { useDispatch, useSelector } from "react-redux";
import { setBottomPanel } from "@store/ui/BottomPanelSlice.js";

import styles from "./ChatButtonComponent.module.css";

export default function ChatButton() {
  const bottomPanelState = useSelector(
    (state) => state.BottomPanelSlice.bottomPanel,
  );
  const dispatch = useDispatch();

  function toggleChatWindow() {
    if (bottomPanelState === "ChatWindowComponent") {
      dispatch(setBottomPanel(null));
    } else {
      dispatch(setBottomPanel("ChatWindowComponent"));
    }
  }
  return <button className={styles.chatButton} onClick={toggleChatWindow} />;
}
