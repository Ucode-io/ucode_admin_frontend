// import { render, screen } from '@testing-library/react';
// import App from './App.jsx';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });
import ReactDOM from "react-dom";
import Providers from "components/Layout/Providers";
import App from "App";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(
    <Providers>
      <App />
    </Providers>,
    div
  );
});
