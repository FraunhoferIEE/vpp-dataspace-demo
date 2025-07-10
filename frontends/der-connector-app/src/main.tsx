import { App as AntdApp, ConfigProvider } from "antd";
import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter as Router } from "react-router-dom";
import App from "./App.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ConfigProvider>
      <Router>
        <AntdApp>
          <App />
        </AntdApp>
      </Router>
    </ConfigProvider>
  </React.StrictMode>
);
