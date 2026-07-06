import { createRoot } from "react-dom/client";
import { Provider } from "react-redux";

import App from "@components/App.jsx";
import { Store } from "@store/Store.js";

createRoot(document.getElementById("root")).render(
  <Provider store={Store}>
    <App />
  </Provider>,
);
