import * as esbuild from "esbuild-wasm"
import wasmURL from "esbuild-wasm/esbuild.wasm?url"
import { virtualFsPlugin } from "./esbuildPlugin"

export async function initEsbuild() {
  await esbuild.initialize({
    wasmURL,
    worker: true,
  })
}

export async function buildProject(monaco) {
  const fs = {};

  for (const model of monaco.editor.getModels()) {
    let path = model.uri.path;

    path = path.startsWith("/") ? path.slice(1) : path;

    if (!path.includes("src") && path !== "src") {
      path = "src/" + path;
    }

    path = "/" + path;

    fs[path] = model.getValue();
  }
  console.log(fs);

  fs["/__entry.jsx"] = `
    import App from "./src/src/App";

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

  // fs["/shims/react-icons-fa.js"] = `
  //   export const FaHome = https://esm.sh/react-icons/fa@4.3.0/FaHome;
  //   export const FaUser = window.ReactIcons.fa.FaUser;
  // `;

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
      "import.meta.env": JSON.stringify({
        VITE_API_URL: "https://admin-api.ucode.run",
        VITE_PROJECT_ID: "f1c4ae97-ee0f-4868-b4fc-1b26869ebc69",
        VITE_MAIN_MENU_ID: "c57eedc3-a954-4262-a0af-376c65b5a284",
        VITE_X_API_KEY: "P-wkLyW3aBURDx6oSwtlhk33WQn8Q3VhIc",
        VITE_ADMIN_BASE_URL: "https://admin-api.ucode.run",
      }),
    },
  });

  return result.outputFiles[0].text;
}
