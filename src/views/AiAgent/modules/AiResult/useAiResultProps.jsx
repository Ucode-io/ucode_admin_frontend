import { useEffect, useRef, useState } from "react";
import { ResultApp } from "./components/ResultApp";
import { ResultCode } from "./components/ResultCode";
import { buildProjectFromFiles, ensureEsbuild } from "../../bundler/build";

export const useAiResultProps = ({ generatedUiRef, files, env }) => {
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
    }, 2000);
  };

  const handleChangeTab = (value) => {
    setActiveTab(value);
    if (value === "app") initialRunCode();
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
        files={files}
      />
    ),
    code: (
      <ResultCode
        editorRef={editorRef}
        monacoRef={monacoRef}
        handleEditorMount={handleEditorMount}
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
