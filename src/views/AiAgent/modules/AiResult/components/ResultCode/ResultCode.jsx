import { Editor } from "@monaco-editor/react"
import { FileTree } from "../FileTree"
import { useResultCodeProps } from "./useResultCodeProps"

import cls from "./styles.module.scss"
import clsx from "clsx";
import "./styles.scss";
import { getFileIcon } from "@/utils/getFileIcon";

export const ResultCode = ({
  handleEditorMount,
  handleUpdateCode,
  editorRef,
  monacoRef,
  files,
}) => {
  const {
    openFile,
    onEditorMount,
    openedFiles,
    activeFile,
    closeFile,
    handleChange,
    changedFiles,
  } =
    useResultCodeProps({
      editorRef,
      monacoRef,
      files,
      handleUpdateCode,
    });

  return (
    <>
      <div className={cls.resultCode}>
        <FileTree onOpen={openFile} files={files} activeFile={activeFile} />
        <div className={cls.editor}>
          <div className={cls.tabs}>
            {openedFiles.map((path, index) => (
              <div
                key={path}
                className={clsx(cls.tab, { [cls.active]: activeFile === path })}
                onClick={() => openFile(path)}
              >
                <span className={cls.tabIcon}>{getFileIcon(path)}</span>
                {path.split("/").pop()}
                {
                  changedFiles.includes(path) && <span className={cls.changed} />
                }
                <button
                  className={cls.close}
                  onClick={(e) => {
                    e.stopPropagation();
                    closeFile(path, index);
                  }}
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            className={"monaco-editor"}
            onMount={(...rest) => {
              handleEditorMount(...rest);
              onEditorMount(...rest);
            }}
            onChange={handleChange}
            options={{
              tabSize: 2,
              fontFamily: "JetBrains Mono, Fira Code, monospace",
              fontSize: 14,
              fontLigatures: true,
              lineNumbers: "on",
              glyphMargin: true,
              folding: true,
              minimap: { enabled: true },
              scrollBeyondLastLine: false,
              formatOnType: true,
              formatOnPaste: true,
              autoIndent: "full",
              quickSuggestions: {
                other: true,
                comments: false,
                strings: true,
              },
              suggestOnTriggerCharacters: true,
              acceptSuggestionOnEnter: "on",
              multiCursorModifier: "alt",
              selectionHighlight: true,
              occurrencesHighlight: "on",
              keybindingService: "vscode",
            }}
          />
        </div>
      </div>
    </>
  );
};
