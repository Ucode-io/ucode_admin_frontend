import cls from "./styles.module.scss";
import { Editor } from "@monaco-editor/react";
import { useFormulaFieldProps } from "./useFormulaEditorProps";
import { Badge } from "@mui/material";
import { BiXCircle } from "react-icons/bi";
import "./styles.scss";
import { forwardRef } from "react";

export const FormulaEditor = forwardRef(
  ({ onChange = () => {}, value, fields }, ref) => {
    const { runValidation, handleEditorMount, error, i18n } =
      useFormulaFieldProps({
        ref,
        fields,
        value,
      });

    return (
      <div className={cls.formulaEditor}>
        {fields?.map((item) => (
          <style>
            {`
                .field-badge-slug--${item?.slug}::after {
                  content: "${item?.attributes?.[`label_${i18n.language}`] || item?.label}" !important;
                  position: absolute;
                  width: calc(100%);
                  background-color: rgb(84 72 49 / 15%) !important;
                  border-radius: 6px;
                  left: 0;
                  padding-left: 16px;
                  font-size: 10px;
                  color: #32302c !important;
                }
            `}
          </style>
        ))}
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
            suggestOnTriggerCharacters: false,
            quickSuggestions: false,
            parameterHints: { enabled: false },
            wordBasedSuggestions: false,
            inlineSuggest: { enabled: false },
            cursorWidth: 1,
            cursorStyle: "line",
            padding: {
              top: 8,
              bottom: 8,
              left: 8,
              right: 8,
            },
          }}
        />
        {error && (
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
        )}
      </div>
    );
  }
);
