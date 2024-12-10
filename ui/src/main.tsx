import ReactDOM from "react-dom";
import "./assets/index.css";
import App from "./components/App";
import React from "react";

import "@livechat/design-system/dist/design-system.css";

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById("root")
);
