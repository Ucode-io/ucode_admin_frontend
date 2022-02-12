import React from "react";
import ReactDOM from "react-dom";
import Providers from "./Providers";
import App from "./App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Providers>
      <App />
    </Providers>,
    div,
  );
});
