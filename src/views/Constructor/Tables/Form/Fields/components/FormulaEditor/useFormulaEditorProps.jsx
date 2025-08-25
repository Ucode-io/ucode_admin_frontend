import { useEffect, useMemo, useRef, useState } from "react";
import {
  countArgsInside,
  CUSTOM_FUNCTIONS,
  CUSTOM_FUNCTIONS_META,
  installCustomFunctions,
  SIG,
} from "./constants";
import { Parser, SUPPORTED_FORMULAS } from "hot-formula-parser";
import { useTranslation } from "react-i18next";

export const useFormulaFieldProps = ({ ref: editorRef, fields, value }) => {
  const monacoRef = useRef(null);
  const parserRef = useRef(null);
  const badgesRef = useRef([]);
  const badgeDecosRef = useRef([]);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [decorations, setDecorations] = useState([]);

  const { i18n } = useTranslation();

  function validateBySignature(code) {
    const markers = [];
    const re = /\b([A-Z_]+)\s*\(/g;
    let m;
    while ((m = re.exec(code))) {
      const fn = m[1];
      if (!SIG[fn]) continue;
      const openIdx = m.index + m[0].length - 1;
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

  const fieldsSlugs = useMemo(() => fields.map((f) => f.slug), [fields]);

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

  const fieldSuggestions = useMemo(
    () =>
      fields.map((field) => ({
        label: field.attributes?.[`label_${i18n.language}`] || field.label,
        kind: 14,
        insertText: field.slug,
        detail: field.type,
      })),
    [fields]
  );

  const functionsList = useMemo(() => {
    return [...SUPPORTED_FORMULAS, ...CUSTOM_FUNCTIONS].map((f) =>
      f.toUpperCase()
    );
  }, []);

  function decorateFields() {
    const editor = editorRef.current;
    const monaco = monacoRef.current || window?.monaco;
    if (!editor || !monaco) return;

    const model = editor.getModel();
    if (!model) return;

    const languageId = model.getLanguageId();
    const lineCount = model.getLineCount();
    const text = model.getValue();

    const tokenized = monaco.editor.tokenize(text, languageId);

    const decos = [];
    const badges = []; // добавим сюда все бейджи

    for (let line = 1; line <= lineCount; line++) {
      const tokens = tokenized[line - 1] || [];
      const lineLen = model.getLineLength(line);

      for (let i = 0; i < tokens.length; i++) {
        const start = (tokens[i].startIndex ?? tokens[i].offset ?? 0) + 1;
        const end =
          i + 1 < tokens.length
            ? (tokens[i + 1].startIndex ?? tokens[i + 1].offset ?? 0) + 1
            : lineLen + 1;

        const scope = tokens[i].scopes || tokens[i].type || "";

        if (typeof scope === "string" && scope.includes("field")) {
          const word = model.getValueInRange({
            startLineNumber: line,
            startColumn: start,
            endLineNumber: line,
            endColumn: end,
          });

          const field = fields.find(
            (f) =>
              (
                f.attributes?.[`label_${i18n.language}`] || f.label
              )?.toLowerCase() === word?.toLowerCase()
          );

          if (field) {
            decos.push({
              range: {
                startLineNumber: line,
                startColumn: start,
                endLineNumber: line,
                endColumn: end,
              },
              options: {
                inlineClassName: `field-badge field-badge--${field?.type}`,
              },
            });

            badges.push({
              label:
                field.attributes?.[`label_${i18n.language}`] || field.label,
              range: { line, start, end },
            });
          }
        }
      }
    }

    badgesRef.current = badges;

    badgeDecosRef.current = editor.deltaDecorations(
      badgeDecosRef.current,
      decos
    );
  }

  const fieldPattern = `\\b(?:${functionsList.join("|")})\\b`;

  let completionProviderRegistered = false;

  function handleEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;

    monaco.languages.register({ id: "formula-lang" });
    monaco.languages.setMonarchTokensProvider("formula-lang", {
      ignoreCase: true,
      tokenizer: {
        root: [
          [new RegExp(`${fieldPattern}(?=\\s*\\()`), "keyword"],
          [new RegExp("(==|!=|<=|>=|=|<|>|\\+|!)", "g"), "operator"],
          [
            new RegExp(
              `\\b(${fields
                .map((f) =>
                  (
                    f.attributes?.[`label_${i18n.language}`] || f?.label
                  ).replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
                )
                .join("|")})\\b`
            ),
            "field",
          ],
          [/\b(true|false)\b/, "boolean"],
          [/\d+(?:\.\d+)?/, "number"],
          [/\".*?\"/, "string"],
          [/[,()]/, "delimiter"],
        ],
      },
    });

    monaco.editor.defineTheme("badge-theme", {
      base: "vs",
      inherit: true,
      rules: [
        { token: "keyword", foreground: "#0077aa" },
        { token: "field", foreground: "ffffff", background: "007acc" },
        { token: "operator", foreground: "#0077aa" },
      ],
      colors: {
        "editor.background": "#f9f8f7",
        "editor.lineHighlightBackground": "#00000000",
        "editor.lineHighlightBorder": "#00000000",
      },
    });

    monaco.editor.setTheme("badge-theme");

    monaco.languages.registerCompletionItemProvider("formula-lang", {
      provideCompletionItems: () => ({
        suggestions: [...functionSuggestions, ...fieldSuggestions],
      }),
    });

    const model = editor.getModel();
    monaco.editor.setModelLanguage(model, "formula-lang");

    editor.onDidChangeModelContent(() => {
      runValidation(editor.getValue());
      decorateFields();
    });

    runValidation(editor.getValue());
    decorateFields();
  }

  monacoRef.current?.editor?.defineTheme("badge-theme", {
    base: "vs",
    inherit: true,
    rules: [
      {
        token: "keyword",
        foreground: "#0077aa",
        fontStyle: "normal",
      },
      {
        token: "field",
        foreground: "#0077aa",
        background: "#007acc",
        fontStyle: "normal",
      },
    ],
    colors: {
      "editor.background": "#f9f8f7",
      "editor.lineHighlightBackground": "#00000000",
      "editor.lineHighlightBorder": "#00000000",
    },
  });

  useEffect(() => {
    if (editorRef.current && monacoRef.current) {
      editorRef.current.onKeyDown((e) => {
        const model = editorRef.current.getModel();
        const position = editorRef.current.getPosition();

        // LeftArrow
        if (e.keyCode === monacoRef.current.KeyCode.LeftArrow) {
          const position = editorRef.current.getPosition();
          const model = editorRef.current.getModel();
          const lineNumber = position.lineNumber;

          const decorations = model
            .getLineDecorations(lineNumber)
            .filter((d) => d.options.inlineClassName?.includes("field-badge"));

          for (const decoration of decorations) {
            const { startLineNumber, endLineNumber, startColumn, endColumn } =
              decoration.range;

            if (
              lineNumber >= startLineNumber &&
              lineNumber <= endLineNumber &&
              position.column === endColumn
            ) {
              e.preventDefault();
              editorRef.current.setPosition({
                lineNumber,
                column: startColumn,
              });
              return;
            }
          }
        }

        // RightArrow
        if (e.keyCode === monacoRef.current.KeyCode.RightArrow) {
          const position = editorRef.current.getPosition();
          const model = editorRef.current.getModel();
          const lineNumber = position.lineNumber;

          const decorations = model
            .getLineDecorations(lineNumber)
            .filter((d) => d.options.inlineClassName?.includes("field-badge"));

          for (const decoration of decorations) {
            const { startLineNumber, endLineNumber, startColumn, endColumn } =
              decoration.range;

            if (
              lineNumber === startLineNumber &&
              lineNumber <= endLineNumber &&
              position.column === startColumn
            ) {
              e.preventDefault();
              editorRef.current.setPosition({
                lineNumber,
                column: endColumn,
              });
              return;
            }
          }
        }

        // Backspace
        if (e.keyCode === monacoRef.current.KeyCode.Backspace) {
          const model = editorRef.current.getModel();
          const position = editorRef.current.getPosition();

          const badge = badgesRef.current.find((b) => {
            return (
              b.range.line === position.lineNumber &&
              position.column > b.range.start &&
              position.column <= b.range.end
            );
          });

          if (badge) {
            e.preventDefault();
            model.pushEditOperations(
              [],
              [
                {
                  range: new monacoRef.current.Range(
                    badge.range.line,
                    badge.range.start + 1,
                    badge.range.line,
                    badge.range.end
                  ),
                  text: "",
                },
              ],
              () => null
            );
          }
        }
      });
    }
  }, [value, editorRef, monacoRef]);

  useEffect(() => {
    return () => {
      if (completionProviderRegistered) {
        completionProviderRegistered.dispose();
      }
    };
  }, []);

  useEffect(() => {
    const parser = new Parser();
    parser.setFunction("NOW", () => new Date());
    parser.setFunction("TODAY", () => {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      return d;
    });
    installCustomFunctions(parser);
    parserRef.current = parser;
  }, []);

  return { runValidation, handleEditorMount, error, i18n };
};