import { useEffect, useRef } from "react";
import { buildProject, initEsbuild } from "../../../../bundler/build";

export const useResultCodeProps = () => {

  const models = new Map()

  const monacoRef = useRef(null)
  const editorRef = useRef(null)

  const esbuildReady = useRef(false)

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }

  const files = {
    "index.jsx": {
      path: "index.jsx",
      language: "javascript",
      value: `import App from "./App"`,
    },
    "App.jsx": {
      path: "App.jsx",
      language: "javascript",
      value: `export default () => <div>Hello</div>`,
    },
  }

  function getModel(file, monaco) {
    if (models.has(file.path)) return models.get(file.path)

    const model = monaco.editor.createModel(
      file.value,
      file.language,
      monaco.Uri.parse(`file:///src/${file.path}`)
    )

    models.set(file.path, model)
    return model
  }

  function openFile(path) {

    const monaco = monacoRef.current
    const editor = editorRef.current

    const file = files[path]
    const model = getModel(file, monaco)
    editor.setModel(model)
  }

  const runCode = async () => {

    if(!esbuildReady.current) {
      await initEsbuild().then(() => {
        esbuildReady.current = true
      })
    }

    const js = await buildProject(monacoRef.current)
    iframeEval(js)
  }

  function iframeEval(code) {
    const iframe = document.getElementById("preview");
  
    iframe.contentWindow?.postMessage(
      {
        type: "EXECUTE",
        code,
      },
      "*"
    );
  }

  useEffect(() => {
    if(esbuildReady.current) return

    initEsbuild().then(() => {
      esbuildReady.current = true
    })

    return () => {
      esbuildReady.current = false
    }
  }, [])

  return {
    openFile,
    files,
    handleEditorMount,
    runCode,
  }
}
