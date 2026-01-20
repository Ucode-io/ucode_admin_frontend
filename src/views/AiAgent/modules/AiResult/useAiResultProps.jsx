import { useEffect, useRef, useState } from "react";
import { ResultApp } from "./components/ResultApp";
import { ResultCode } from "./components/ResultCode";
import { buildProjectFromFiles, ensureEsbuild } from "../../bundler/build";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";

export const useAiResultProps = ({ generatedUiRef, files, env, handleUpdateCode = () => {} }) => {

  const { changedFiles } = useSelector((state) => state.codeEditor);

  const dispatch = useDispatch();

  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const [activeTab, setActiveTab] = useState("app");
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      label: "App",
      value: "app",
    },
    {
      label: "Code",
      value: "code",
    },
  ];

  const initialRunCode = () => {
    setTimeout(() => {
      runCode();
      setLoading(false);
    }, 2000);
  };

  const handleChangeTab = (value) => {
    setActiveTab(value);
    if (value === "app") {

      if(changedFiles.length) {
        const editor = editorRef.current;
        const monaco = monacoRef.current
    
        if (!editor) return;

        const files = changedFiles.map(path => {
          const model = monaco.editor.getModels().find(m => m.uri.path === `/${path}`)
          return {
            path,
            content: model.getValue()
          }
        })

        handleUpdateCode(files);

        changedFiles.forEach(path => {
          dispatch(editorActions.removeChangedFile(path));
        })
      }

      initialRunCode();
    }
  };

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }

  const tabContent = {
    app: (
      <ResultApp
        ref={generatedUiRef}
        monaco={monacoRef.current}
      />
    ),
    code: (
      <ResultCode
        editorRef={editorRef}
        monacoRef={monacoRef}
        handleEditorMount={handleEditorMount}
        handleUpdateCode={handleUpdateCode}
        ref={generatedUiRef}
        files={files}
      />
    ),
  };

  const runCode = async () => {
    await ensureEsbuild();

    const js = await buildProjectFromFiles(files, env);
    iframeEval(js);
  };

  function iframeEval(code) {
    const iframe = document.getElementById("preview");

    iframe.contentWindow?.postMessage(
      {
        type: "EXECUTE",
        code,
      },
      "*",
    );
  }

  useEffect(() => {
    setLoading(true);
    initialRunCode();
  }, []);

  return {
    activeTab,
    tabs,
    handleChangeTab,
    tabContent,
    runCode,
    loading,
  };
};
