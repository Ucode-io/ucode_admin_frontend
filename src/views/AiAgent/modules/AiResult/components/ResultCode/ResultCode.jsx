import { Editor } from "@monaco-editor/react"
import { FileTree } from "../FileTree"
import { useResultCodeProps } from "./useResultCodeProps"
import { OpenedTabs } from "../OpenedTabs";

import cls from "./styles.module.scss"
import "./styles.scss";

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
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    setIsSearchOpen,
    searchResults,
    handleGlobalSearch,
    jumpToCode,
    expandedFiles,
    toggleFile,
  } = useResultCodeProps({
    editorRef,
    monacoRef,
    files,
    handleUpdateCode,
  });

  return (
    <>
      <div className={cls.resultCode}>
        <FileTree
          onOpen={openFile}
          files={files}
          activeFile={activeFile}
          isSearchOpen={isSearchOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          setIsSearchOpen={setIsSearchOpen}
          searchResults={searchResults}
          handleGlobalSearch={handleGlobalSearch}
          jumpToCode={jumpToCode}
          expandedFiles={expandedFiles}
          toggleFile={toggleFile}
        />
        <div className={cls.editor}>
          <OpenedTabs
            activeFile={activeFile}
            openedFiles={openedFiles}
            openFile={openFile}
            closeFile={closeFile}
            changedFiles={changedFiles}
          />
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
