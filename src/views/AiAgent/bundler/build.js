import * as esbuild from "esbuild-wasm"
import wasmURL from "esbuild-wasm/esbuild.wasm?url"
import { virtualFsPlugin } from "./esbuildPlugin"

let initPromise = null;

export function ensureEsbuild() {
  if (!initPromise) {
    initPromise = esbuild.initialize({
      wasmURL,
      worker: true,
    });
  }
  return initPromise;
}

export async function buildProjectFromFiles(files, env) {
  const fs = {};

  for (const file of Object.values(files)) {
    let path = file.path;

    // normalize: src/App.jsx → /src/App.jsx
    path = path.startsWith("/") ? path.slice(1) : path;

    if (!path.startsWith("src/")) {
      path = "src/" + path;
    }

    path = "/" + path;

    fs[path] = file.value;
  }

  fs["/__entry.jsx"] = `
    import App from "./src/App";

    const React = window.React;
    const ReactDOM = window.ReactDOM;

    const root = ReactDOM.createRoot(
      document.getElementById("root")
    );

    root.render(React.createElement(App));
  `;

  fs["/shims/react.js"] = `
    export default window.React;
    export const useState = window.React.useState;
    export const useEffect = window.React.useEffect;
    export const useRef = window.React.useRef;
    export const useMemo = window.React.useMemo;
    export const useCallback = window.React.useCallback;
  `;

  fs["/shims/react-dom.js"] = `
    export default window.ReactDOM;
  `;

  fs["/shims/react-dom-client.js"] = `
    export const createRoot = window.ReactDOM.createRoot;
  `;

  fs["/shims/axios.js"] = `
    export default window.axios;
  `;

  fs["/shims/react-router-dom.js"] = `
    const RRD = window.ReactRouterDOM;

    export const BrowserRouter = RRD.MemoryRouter;
    export const HashRouter = RRD.MemoryRouter;
    export const MemoryRouter = RRD.MemoryRouter;

    export const Routes = RRD.Routes;
    export const Route = RRD.Route;
    export const Link = RRD.Link;
    export const NavLink = RRD.NavLink;
    export const Navigate = RRD.Navigate;
    export const Outlet = RRD.Outlet;

    export const useParams = RRD.useParams;
    export const useNavigate = RRD.useNavigate;
    export const useLocation = RRD.useLocation;
  `;

  const result = await esbuild.build({
    entryPoints: ["__entry.jsx"],
    bundle: true,
    write: false,
    platform: "browser",

    format: "iife",
    globalName: "__APP__",

    plugins: [virtualFsPlugin(fs)],

    define: {
      "process.env.NODE_ENV": '"development"',
      "import.meta.env": JSON.stringify(env),
    },
  });

  return result.outputFiles[0].text;
}
