import LeftPanelComponent from "@components/ui/LeftPanelComponent";
import RightPanelComponent from "@components/ui/RightPanelComponent";
import CenterPanelComponent from "@components/ui/CenterPanelComponent";

function App() {
  return (
    <div id="layout">
      <LeftPanelComponent />
      <div id="game">
        <CenterPanelComponent />
      </div>
      <RightPanelComponent />
    </div>
  );
}

export default App;
