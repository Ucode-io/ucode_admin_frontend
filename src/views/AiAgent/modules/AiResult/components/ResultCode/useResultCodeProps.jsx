import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";

import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";
import { generatedUiActions } from "@/store/generatedUi/generatedUi.slice";
import { useCallback, useEffect, useRef } from "react";

export const useResultCodeProps = ({ monacoRef, editorRef, files, handleUpdateCode }) => {
  const { openedFiles, activeFile, changedFiles } = useSelector((state) => state.codeEditor);

  const dispatch = useDispatch();

  const activeFileRef = useRef(activeFile);

  const setOpenFiles = (payload) => {
    dispatch(editorActions.setOpenedFiles(payload));
  };

  const setActiveFile = (payload) => {
    dispatch(editorActions.setActiveFile(payload));
  };

  const handleSave = useCallback(() => {
    const file = activeFileRef.current;
    const editor = editorRef.current;
    
    if (!file || !editor) return;

    const content = editor.getValue();

    if (!content) return;

    const savedFile = {
      path: file,
      content
    }

    handleUpdateCode([savedFile])

    dispatch(editorActions.removeChangedFile(file));
  }, []);

  function registerSaveShortcut(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        handleSave();
      }
    );
  }

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

    files.forEach((file) => {
      monaco.languages.typescript.typescriptDefaults.addExtraLib(
        file.content,
        `file:///${file.path}`,
      );
    });

    if (activeFile) {
      openFile(activeFile);
    }

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

    registerSaveShortcut(editor, monaco);

  }

  function openPathInModel (path) {
    const monaco = monacoRef.current;
    const editor = editorRef.current;

    const uri = monaco.Uri.parse(`file:///${path}`);
    const model = monaco.editor.getModel(uri);

    if (!model) return;

    editor.setModel(model);
  }

  function openFile(path) {
    
    openPathInModel(path);

    setOpenFiles(
      openedFiles.includes(path) ? openedFiles : [...openedFiles, path],
    );

    setActiveFile(path);
  }

  function closeFile(path, index) {
    const filteredOpenedFiles = openedFiles.filter((f) => f !== path)

    setOpenFiles(filteredOpenedFiles);

    if(path === activeFile) {
      setActiveFile(filteredOpenedFiles[index - 1] || filteredOpenedFiles[index]);
      openPathInModel(filteredOpenedFiles[index - 1] || filteredOpenedFiles[index]);
    }
  }

  function initAllModels(files) {
    const monaco = monacoRef.current;

    files.forEach((file, index) => {
      const uri = monaco.Uri.parse(`file:///${file.path}`);
      let model = monaco.editor.getModel(uri);

      if (!model) {
        model = monaco.editor.createModel(file.content, file.language, uri);
      }

      model.onDidChangeContent(() => {
        dispatch(generatedUiActions.updateFile({index, content: model.getValue()}));
      });
    });
  }

  function handleChange () {
    if(changedFiles.includes(activeFile)) return;
    dispatch(editorActions.addChangedFile(activeFile));
  }

  useEffect(() => {
    activeFileRef.current = activeFile;
  }, [activeFile]);

  return {
    files,
    openFile,
    onEditorMount,
    openedFiles,
    activeFile,
    closeFile,
    handleChange,
    changedFiles,
  };
};
