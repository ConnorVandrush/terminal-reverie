import LeftPanelComponent from "./ui/LeftPanelComponent";
import RightPanelComponent from "./ui/RightPanelComponent";

function App() {
  return (
    <div id="layout">
      <LeftPanelComponent></LeftPanelComponent>
      <div id="game"></div>
      <RightPanelComponent></RightPanelComponent>
    </div>
  );
}

export default App;
