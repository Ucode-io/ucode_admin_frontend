import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";

import { useState } from "react";

export const useResultCodeProps = ({ monacoRef, editorRef, files }) => {
  const [openFiles, setOpenFiles] = useState([]);
  const [activeFile, setActiveFile] = useState("");

  function onEditorMount(editor, monaco) {
    monacoRef.current = monaco;
    editorRef.current = editor;

    monaco.editor.defineTheme("vscode-dark", {
      base: "vs-dark",
      inherit: true,
      rules: [],
      colors: {
        "editor.background": "#1e1e1e",
        "editor.lineHighlightBackground": "#2a2d2e",
        "editorCursor.foreground": "#aeafad",
        "editor.selectionBackground": "#264f78",
        "editor.inactiveSelectionBackground": "#3a3d41",
      },
    });

    monaco.editor.setTheme("vscode-dark");

    initAllModels(files);

    Object.values(files).forEach((file) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.value,
        `file:///${file.path}`,
      );
    });

    editor.addAction({
      id: "format-with-prettier",
      label: "Format Document",
      keybindings: [
        monaco.KeyMod.Shift | monaco.KeyMod.Alt | monaco.KeyCode.KeyF,
      ],
      run: () => {
        const value = editor.getValue();
        const formatted = prettier.format(value, {
          parser: "babel",
          plugins: [parserBabel, parserTypescript],
        });
        editor.setValue(formatted);
      },
    });
  }

  function openFile(path) {
    const monaco = monacoRef.current;
    const editor = editorRef.current;

    const uri = monaco.Uri.parse(`file:///${path}`);
    const model = monaco.editor.getModel(uri);

    if (!model) return;

    // 🔹 добавить таб, если его ещё нет
    setOpenFiles((prev) => (prev.includes(path) ? prev : [...prev, path]));

    // 🔹 активный файл
    setActiveFile(path);

    // 🔹 переключить Monaco
    editor.setModel(model);
  }

  function closeFile(path) {
    setOpenFiles((prev) => prev.filter((f) => f !== path));
  }

  function initAllModels(files) {
    const monaco = monacoRef.current;

    Object.values(files).forEach((file) => {
      const uri = monaco.Uri.parse(`file:///${file.path}`);
      let model = monaco.editor.getModel(uri);

      if (!model) {
        model = monaco.editor.createModel(file.value, file.language, uri);
      }

      model.onDidChangeContent(() => {
        files[file.path].value = model.getValue();
      });
    });
  }

  return { files, openFile, onEditorMount, openFiles, activeFile, closeFile };
};
