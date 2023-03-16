import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.scss";

navigator.serviceWorker.register("/firebase-messaging-sw.js");

const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <>
    <App />
  </>
);
