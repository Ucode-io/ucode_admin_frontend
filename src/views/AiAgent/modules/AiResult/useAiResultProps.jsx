import { useRef, useState } from "react";
import { ResultApp } from "./components/ResultApp";
import { ResultCode } from "./components/ResultCode";

export const useAiResultProps = ({ generatedUiRef }) => {

  const monacoRef = useRef(null)
  const editorRef = useRef(null)

  const [activeTab, setActiveTab] = useState("app");

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

  const handleChangeTab = (value) => {
    setActiveTab(value);
  };

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }

  const tabContent = {
    app: <ResultApp ref={generatedUiRef} />,
    code: <ResultCode 
      editor={editorRef.current}
      monaco={monacoRef.current}
      handleEditorMount={handleEditorMount}
    />,
  };

  // const runCode = async () => {
  //   await initEsbuild()
  //   const js = await buildProject(monacoRef.current)
  //   iframeEval(js)
  // }

  // function iframeEval(js) {
  //   const iframe = document.getElementById("preview")
  
  //   iframe.contentWindow.postMessage(
  //     { type: "eval", code: js },
  //     "*"
  //   )
  // }

  // useEffect(() => {
  //   initEsbuild()
  // }, [])


  return {
    activeTab,
    tabs,
    handleChangeTab,
    tabContent,
  };
};
