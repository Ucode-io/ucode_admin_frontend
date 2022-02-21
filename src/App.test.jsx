import ReactDOM from "react-dom";
import Providers from "./Providers";
import App from "./App";
import i18n from "locales/i18n";

describe("our app", () => {
  beforeAll(() => {
    i18n.init();
  });

  it("renders without crashing", () => {
    const div = document.createElement("div");
    ReactDOM.render(
      <Providers>
        <App />
      </Providers>,
      div,
    );
  });
});
