import LeftPanelComponent from "@components/ui/LeftPanelComponent";
import RightPanelComponent from "@components/ui/RightPanelComponent";
import CenterPanelComponent from "@components/ui/CenterPanelComponent";
import BottomPanelComponent from "@components/ui/BottomPanelComponent";

function App() {
  return (
    <div id="layout">
      <LeftPanelComponent />
      <div id="game">
        <div id="gameOverlay">
          <CenterPanelComponent />
          <BottomPanelComponent />
        </div>
      </div>
      <RightPanelComponent />
    </div>
  );
}

export default App;
