import { Editor } from "@monaco-editor/react";
import cls from "./styles.module.scss"
import { useFormulaFieldProps } from "./useFormulaEditorProps"
import "./styles.scss"

export const FormulaEditor = () => {

  const {value, setValue, runValidation, handleEditorMount} = useFormulaFieldProps();

  return <div className={cls.formulaEditor}>
    <Editor
      className="monaco-editor"
      height="96px"
      width="100%"
      defaultLanguage="formula-lang"
      defaultValue={value}
      onMount={handleEditorMount}
      theme="badge-theme"
      onChange={(v) => {
        setValue(v ?? '');
        runValidation(v ?? '');
      }}
      options={{
        fontSize: 14,
        overviewRulerLanes: 0,
        hideCursorInOverviewRuler: true,
        renderLineHighlight: "none",
        roundedSelection: true,
        minimap: { enabled: false },
        scrollBeyondLastLine: false,
        renderValidationDecorations: "on",
        lineNumbers: "off",
        glyphMargin: false,
        folding: false,
        wordWrap: "on",
        wordWrapColumn: 0,
        wrappingIndent: "same",
        scrollbar: { horizontal: "hidden", handleMouseWheel: true },
      }}
    />
  </div>
}