import { useDispatch, useSelector } from "react-redux";
import { setCenterPanel } from "@store/ui/CenterPanelSlice.js";

import styles from "./TradeButtonComponent.module.css";

export default function TradeButtonComponent() {
  const centerPanelState = useSelector(
    (state) => state.CenterPanelSlice.centerPanel,
  );
  const dispatch = useDispatch();

  function toggleTradeWindow() {
    if (centerPanelState === "TradeWindowComponent") {
      dispatch(setCenterPanel(null));
    } else {
      dispatch(setCenterPanel("TradeWindowComponent"));
    }
  }
  return <button className={styles.tradeButton} onClick={toggleTradeWindow} />;
}
