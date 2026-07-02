import LeftPanel from "./ui/LeftPanel";
import RightPanel from "./ui/RightPanel";

function App() {
  return (
    <div id="layout">
      <LeftPanel></LeftPanel>
      <div id="game"></div>
      <RightPanel></RightPanel>
    </div>
  );
}

export default App;
