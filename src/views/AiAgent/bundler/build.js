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
    import App from "./App"

    const React = window.React;
    const ReactDOM = window.ReactDOM;

    const root = ReactDOM.createRoot(
      document.getElementById("root")
    )

    root.render(React.createElement(App))
  `

  const result = await esbuild.build({
    entryPoints: ["/src/__entry.jsx"],
    bundle: true,
    write: false,
    format: "esm",
    plugins: [virtualFsPlugin(fs)],
    platform: "browser",
    external: ["react", "react-dom", "react-dom/client"],
  })

  return result.outputFiles[0].text
}
