import cls from "./styles.module.scss";
import { Editor } from "@monaco-editor/react";
import { useFormulaFieldProps } from "./useFormulaEditorProps";
import { Badge } from "@mui/material";
import { BiXCircle } from "react-icons/bi";
import "./styles.scss";
import { forwardRef } from "react";

export const FormulaEditor = forwardRef(
  ({ onChange = () => {}, value, fields }, ref) => {
    const { runValidation, handleEditorMount, error } = useFormulaFieldProps({
      ref,
      fields,
    });

    return (
      <div className={cls.formulaEditor}>
        <Editor
          className="monaco-editor"
          height="96px"
          width="100%"
          defaultLanguage="formula-lang"
          defaultValue={value}
          onMount={handleEditorMount}
          theme="badge-theme"
          value={value}
          onChange={(v) => {
            onChange(v ?? "");
            runValidation(v ?? "");
          }}
          options={{
            fontSize: 14,
            lineHeight: 20,
            fontFamily:
              "Fira Code, Menlo, Monaco, Consolas, 'Courier New', monospace",
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
            suggestOnTriggerCharacters: false, // отключает автоподсказки при наборе (. или др.)
            quickSuggestions: false, // убирает всплывающие подсказки вообще
            parameterHints: { enabled: false }, // отключает подсказки по параметрам функций
            wordBasedSuggestions: false, // чтобы не предлагал похожие слова из текста
            inlineSuggest: { enabled: false }, // отключает ghost-text предложения
            cursorWidth: 1, // толщина курсора (по умолчанию 2)
            cursorStyle: "line",
            padding: {
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            },
          }}
        />
        {
          error && (
            <Badge
              variant="destructive"
              sx={{
                display: "flex",
                alignItems: "center",
                columnGap: "4px",
                color: "#cd3c3a",
                marginY: "12px",
              }}
            >
              <BiXCircle className="w-4 h-4" /> {error}
            </Badge>
          )
          // <Badge className="flex items-center gap-1">
          //   <Check className="w-4 h-4" /> Нет ошибок
          // </Badge>
        }
      </div>
    );
  }
);
