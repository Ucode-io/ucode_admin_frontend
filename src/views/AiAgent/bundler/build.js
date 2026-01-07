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

  const fs = {}

  for (const model of monaco.editor.getModels()) {
    fs[model.uri.path] = model.getValue()
  }

  fs["/src/__entry.jsx"] = `
    // import React from "react"
    // import ReactDOM from "react-dom"
    import App from "./src/App"

    const React = window.React;
    const ReactDOM = window.ReactDOM;

    const root = ReactDOM.createRoot(
      document.getElementById("root")
    )

    root.render(React.createElement(App))
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

  const result = await esbuild.build({
    entryPoints: ["/src/__entry.jsx"],
    bundle: true,
    write: false,
    platform: "browser",

    format: "iife",
    globalName: "__APP__",

    plugins: [virtualFsPlugin(fs)],

    define: {
      "process.env.NODE_ENV": '"development"',
    },
  });
   

  return result.outputFiles[0].text
}
