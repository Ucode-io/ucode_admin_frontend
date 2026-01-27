import { useEffect, useRef, useState } from "react";
import { ResultApp } from "./components/ResultApp";
import { ResultCode } from "./components/ResultCode";
import { buildProjectFromFiles, ensureEsbuild } from "@/utils/bundler/build";
import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";
import { generatePreviewHtml } from "@/utils/generatePreviewHtml";

export const useAiResultProps = ({
  files,
  env,
  generatedUiRef,
  handleUpdateCode = () => {},
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
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="20"
          height="20"
          x="0"
          y="0"
          viewBox="0 0 24 24"
          enableBackground="new 0 0 512 512"
          xmlSpace="preserve"
          className=""
        >
          <g>
            <g fill="#000" fillRule="evenodd" clipRule="evenodd">
              <path
                d="M4.5 3.75a.75.75 0 0 0-.75.75v15c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75v-15a.75.75 0 0 0-.75-.75zm-2.25.75A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25z"
                fill="currentColor"
                opacity="1"
                data-original="#000000"
                className=""
              ></path>
              <path
                d="M8 2.25a.75.75 0 0 1 .75.75v18a.75.75 0 0 1-1.5 0V3A.75.75 0 0 1 8 2.25z"
                fill="currentColor"
                opacity="1"
                data-original="#000000"
                className=""
              ></path>
              <path
                d="M5.75 21a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3a.75.75 0 0 1-.75-.75zM5.75 3a.75.75 0 0 1 .75-.75h3a.75.75 0 0 1 0 1.5h-3A.75.75 0 0 1 5.75 3z"
                fill="currentColor"
                opacity="1"
                data-original="#000000"
              ></path>
            </g>
          </g>
        </svg>
      ),
    },
    {
      label: "Code",
      value: "code",
      // icon: <CodeIcon />
      icon: (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          version="1.1"
          width="20"
          height="20"
          x="0"
          y="0"
          viewBox="0 0 24 24"
          enableBackground="new 0 0 512 512"
          xmlSpace="preserve"
          className=""
        >
          <g>
            <g fill="#000">
              <path
                d="M4.5 3.75a.75.75 0 0 0-.75.75v15c0 .414.336.75.75.75h15a.75.75 0 0 0 .75-.75v-15a.75.75 0 0 0-.75-.75zm-2.25.75A2.25 2.25 0 0 1 4.5 2.25h15a2.25 2.25 0 0 1 2.25 2.25v15a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25z"
                fill="currentColor"
                opacity="1"
                data-original="#000000"
              ></path>
              <path
                d="M2.25 16a.75.75 0 0 1 .75-.75h18a.75.75 0 0 1 0 1.5H3a.75.75 0 0 1-.75-.75z"
                fill="currentColor"
                opacity="1"
                data-original="#000000"
                className=""
              ></path>
              <g fillRule="evenodd" clipRule="evenodd">
                <path
                  d="M3 13.75a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75zM21 13.75a.75.75 0 0 1 .75.75v3a.75.75 0 0 1-1.5 0v-3a.75.75 0 0 1 .75-.75z"
                  fill="currentColor"
                  opacity="1"
                  data-original="#000000"
                ></path>
              </g>
            </g>
          </g>
        </svg>
      ),
    },
  ];

  const handleChangeTab = (value) => {
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
    app: (
      <ResultApp
        monaco={monacoRef.current}
        ref={generatedUiRef}
        srcDoc={srcDoc}
        loading={loading}
      />
    ),
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
  };
};
