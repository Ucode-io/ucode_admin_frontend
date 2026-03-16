import { useEffect, useRef, useState } from "react";
import { ResultApp } from "./components/ResultApp";
import { ResultCode } from "./components/ResultCode";
import { buildProjectFromFiles, ensureEsbuild } from "@/utils/bundler/build";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";
import { generatePreviewHtml } from "@/utils/generatePreviewHtml";
import { BottomBarIcon, ChatIcon, LeftBarIcon } from "@/utils/constants/icons";

export const useAiResultProps = ({
  files,
  env,
  generatedUiRef,
  handleUpdateCode = () => {},
  setChatVisible,
  chatVisible,
}) => {
  const { changedFiles } = useSelector((state) => state.codeEditor);

  const dispatch = useDispatch();

  const monacoRef = useRef(null);
  const editorRef = useRef(null);

  const [srcDoc, setSrcDoc] = useState(null);
  const [activeTab, setActiveTab] = useState("app");
  const [loading, setLoading] = useState(false);

  const tabs = [
    {
      label: "App",
      value: "app",
      // icon: <WebIcon />,
      icon: <LeftBarIcon />,
    },
    {
      label: "Code",
      value: "code",
      // icon: <CodeIcon />
      icon: <BottomBarIcon />,
    },
    {
      label: "Chat",
      value: "chat",
      // icon: <CodeIcon />
      icon: <ChatIcon />,
    },
  ];

  const handleChangeTab = (value) => {
    if (value === "chat") {
      if (activeTab !== "code") setChatVisible((prev) => !prev);
      return;
    }

    if (value === "code") {
      setChatVisible(false);
    }

    setActiveTab(value);
    if (value === "app") {
      if (changedFiles.length) {
        const editor = editorRef.current;
        const monaco = monacoRef.current;

        if (!editor) return;

        const files = changedFiles.map((path) => {
          const model = monaco.editor
            .getModels()
            .find((m) => m.uri.path === `/${path}`);
          return {
            path,
            content: model.getValue(),
          };
        });

        handleUpdateCode(files);

        changedFiles.forEach((path) => {
          dispatch(editorActions.removeChangedFile(path));
        });
      }
    }
  };

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;
  }

  const tabContent = {
    app: <ResultApp srcDoc={srcDoc} loading={loading} />,
    code: (
      <ResultCode
        editorRef={editorRef}
        monacoRef={monacoRef}
        handleEditorMount={handleEditorMount}
        handleUpdateCode={handleUpdateCode}
        files={files}
      />
    ),
  };

  const runCode = async () => {
    setLoading(true);
    try {
      await ensureEsbuild();
      const { code, dependencies } = await buildProjectFromFiles(files, env);

      const html = generatePreviewHtml(code, dependencies);

      setSrcDoc(html);
    } catch (err) {
      console.error("Build failed:", err);
      setSrcDoc(
        `<html><body><pre style="color:red">${err.message}</pre></body></html>`,
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeout = setTimeout(() => {
      runCode();
    }, 1000);
    return () => clearTimeout(timeout);
  }, [files]);

  return {
    activeTab,
    tabs,
    handleChangeTab,
    tabContent,
    loading,
    srcDoc,
    chatVisible,
    setChatVisible,
  };
};
