import { Editor } from "@monaco-editor/react"
import { FileTree } from "../FileTree"
import { useResultCodeProps } from "./useResultCodeProps"

import cls from "./styles.module.scss"
import "./styles.scss"
import { forwardRef } from "react";

export const ResultCode = forwardRef((props, ref) => {
  const { files, openFile, handleEditorMount, runCode } = useResultCodeProps();

  return (
    <>
      <div className={cls.resultCode}>
        <FileTree onOpen={openFile} files={files} />
        <div className={cls.editor}>
          <Editor
            height="100%"
            defaultLanguage="javascript"
            className={"monaco-editor"}
            onMount={handleEditorMount}
            options={{
              tabSize: 2,
            }}
          />
        </div>
      </div>
      <button onClick={runCode} type="button">
        RuN
      </button>
      <iframe
        ref={ref}
        id="preview"
        src="/iframe.html"
        sandbox="allow-scripts"
        style={{ width: "100%", height: "100%", border: 0 }}
      />
    </>
  );
});

ResultCode.displayName = "ResultCode";
