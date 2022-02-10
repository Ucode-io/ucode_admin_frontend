import { HashRouter } from "react-router-dom";
import './App.scss';
import AppRouter from "./routes/index.jsx";

export default function App() {
  return (
    <HashRouter>
      <AppRouter />
    </HashRouter>
  );
}
