import React from "react";
import ReactDOM from "react-dom";
import App from "./App.jsx";
import reportWebVitals from "./reportWebVitals";
import "tailwindcss/tailwind.css";
import "./index.css";
import "./config/defaultSettings";
import "../src/locales/i18n";
import theme from "./theme";
// react-redux
import { store, persistor } from "./redux/store";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { ThemeProvider } from "styled-components";

ReactDOM.render(
  <Provider store={store}>
    <PersistGate loading={null} persistor={persistor}>
      <ThemeProvider theme={theme}>
        <App />
      </ThemeProvider>
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
reportWebVitals();
