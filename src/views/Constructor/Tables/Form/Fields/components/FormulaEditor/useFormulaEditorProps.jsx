import { useEffect, useMemo, useRef, useState } from "react";
import {
  countArgsInside,
  CUSTOM_FUNCTIONS,
  CUSTOM_FUNCTIONS_META,
  installCustomFunctions,
  SIG,
} from "./constants";
import { Parser, SUPPORTED_FORMULAS } from "hot-formula-parser";

export const useFormulaFieldProps = ({ ref: editorRef }) => {
  // const editorRef = useRef(null);
  const monacoRef = useRef(null);
  const parserRef = useRef(null);

  // const [value, setValue] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  function validateBySignature(code) {
    const markers = [];
    const re = /\b([A-Z_]+)\s*\(/g;
    let m;
    while ((m = re.exec(code))) {
      const fn = m[1];
      if (!SIG[fn]) continue;
      const openIdx = m.index + m[0].length - 1; // позиция '('
      const args = countArgsInside(code, openIdx);
      if (args === 0) {
        markers.push({
          message: `Function ${fn} has unclosed parentheses. [${openIdx},${openIdx + 1}]`,
        });
        continue;
      }
      const spec = SIG[fn];
      if (!spec.variadic) {
        if (spec.min != null && args < spec.min) {
          markers.push({
            message: `Function ${fn} expects ${spec.min} arguments, but only ${args} were provided. [${m.index},${m.index + fn.length}]`,
          });
        }
        if (spec.max != null && args > spec.max) {
          markers.push({
            message: `Function ${fn} expects at most ${spec.max} arguments, but ${args} were provided. [${m.index},${m.index + fn.length}]`,
          });
        }
      } else {
        if (spec.min != null && args < spec.min) {
          markers.push({
            message: `Function ${fn} expects at least ${spec.min} arguments, but only ${args} were provided. [${m.index},${m.index + fn.length}]`,
          });
        }
      }
    }
    return markers;
  }

  function runValidation(code) {
    const issues = validateBySignature(code?.toUpperCase());
    setError(issues.length ? issues[0].message : null);
    if (editorRef.current && window.monaco) {
      const monaco = window.monaco;
      const model = editorRef.current.getModel();
      monaco.editor.setModelMarkers(
        model,
        "formula-check",
        issues.map((it) => ({
          message: it.message,
          severity: monaco.MarkerSeverity.Error,
          startLineNumber: 1,
          startColumn: 1,
          endLineNumber: 1,
          endColumn: Math.max(2, code.length + 1),
        }))
      );
    }
  }

  // function evaluate() {
  //   if (!parserRef.current) return;
  //   const res = parserRef.current.parse(value);
  //   if (res.error) {
  //     setResult(null);
  //     setError(String(res.error));
  //   } else {
  //     setError(null);
  //     setResult(res.result);
  //   }
  // }

  const functionSuggestions = useMemo(
    () =>
      CUSTOM_FUNCTIONS_META.map((f) => ({
        label: f.name,
        kind: 2,
        insertText: f.snippet.replaceAll("[", "").replaceAll("]", ""),
        detail: f.hint,
      })),
    []
  );

  const functionsList = useMemo(() => {
    return [...SUPPORTED_FORMULAS, ...CUSTOM_FUNCTIONS].map((f) =>
      f.toUpperCase()
    );
  }, []);

  let completionProviderRegistered = false;

  function handleEditorMount(editor, monaco) {
    editorRef.current = editor;
    monacoRef.current = monaco;

    // Регистрируем простой язык и автодополнение
    monaco.languages.register({ id: "formula-lang" });
    monaco.languages.setMonarchTokensProvider("formula-lang", {
      ignoreCase: true,
      tokenizer: {
        root: [
          [
            /\b(NOW|TODAY|DATEADD|DATESUBTRACT|DATEBETWEEN|DATERANGE|DATESTART|DATEEND|TIMESTAMP|FROMTIMESTAMP|FORMATDATE|PARSEDATE|IFS|EMPTY|LENGTH|FORMAT|EQUAL|UNEQUAL|LET|LETS|WEEK|AT|FIRST|LAST|SORT|SLICE|REVERSE|FINDINDEX|FILTER|TONUMBER)\b/,
            "keyword",
          ],
          [new RegExp(`\\b(${functionsList.join("|")})\\b`), "keyword"],
          [
            /\b(SINGLE_LINE|MULTI_LINE|EMAIL|INTERNATION_PHONE|LOOKUP|LOOKUPS|TEXT|NUMBER|DATE|TIME|DATE_TIME|DATE_TIME_WITHOUT_TIME_ZONE|CHECKBOX|SWITCH)\b/,
            "custom-type",
          ],
          [/\b(true|false)\b/, "boolean"],
          [/\d+(?:\.\d+)?/, "number"],
          [/".*?"/, "string"],
          [/[,()]/, "delimiter"],
        ],
      },
    });

    completionProviderRegistered =
      monaco.languages.registerCompletionItemProvider("formula-lang", {
        provideCompletionItems: () => ({ suggestions: functionSuggestions }),
      });

    const model = editor.getModel();
    monaco.editor.setModelLanguage(model, "formula-lang");

    // Первая валидация
    runValidation(editor.getValue());
  }

  const insertText = (text) => {
    if (!editorRef.current) return;
    editorRef.current.trigger("keyboard", "type", { text });
    editorRef.current.focus();
  };

  monacoRef.current?.editor?.defineTheme("badge-theme", {
    base: "vs",
    inherit: true,
    rules: [
      {
        token: "keyword",
        foreground: "#0077aa",
        background: "007acc",
        fontStyle: "normal",
      },
      {
        token: "type",
        foreground: "#32302c",
        background: "54483126",
        fontStyle: "normal",
      },
      { token: "number", foreground: "#990055" },
    ],
    colors: {
      "editor.background": "#f9f8f7",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
    },
  });

  useEffect(() => {
    return () => {
      if (completionProviderRegistered) {
        completionProviderRegistered.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const parser = new Parser();

    // Алиасы для соответствия заданным примерам
    parser.setFunction("NOW", () => new Date());
    parser.setFunction("TODAY", () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    });

    installCustomFunctions(parser);
    parserRef.current = parser;
  }, []);

  return { runValidation, handleEditorMount, error };
};
