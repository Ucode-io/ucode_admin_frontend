import prettier from "prettier/standalone";
import parserBabel from "prettier/parser-babel";
import parserTypescript from "prettier/parser-typescript";

import { useDispatch, useSelector } from "react-redux";
import { editorActions } from "@/store/codeEditor/codeEditor.slice";
import { generatedUiActions } from "@/store/generatedUi/generatedUi.slice";
import { useCallback, useEffect, useRef, useState } from "react";

export const useResultCodeProps = ({ monacoRef, editorRef, files, handleUpdateCode }) => {
  const { openedFiles, activeFile, changedFiles } = useSelector((state) => state.codeEditor);

  const dispatch = useDispatch();

  const activeFileRef = useRef(activeFile);

  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const [expandedFiles, setExpandedFiles] = useState({});

  const toggleFile = (filePath) => {
    setExpandedFiles((prev) => ({
      ...prev,
      [filePath]: !prev[filePath],
    }));
  };

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

  const handleGlobalSearch = (query) => {
    setSearchQuery(query);

    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    const groupedResults = []; // Массив групп файлов
    const lowerQuery = query.toLowerCase();

    // Для авто-раскрытия найденных файлов
    const newExpandedState = {};

    files.forEach((file) => {
      const fileMatches = [];

      const lines = file.content.split("\n");
      lines.forEach((line, index) => {
        if (line.toLowerCase().includes(lowerQuery)) {
          fileMatches.push({
            lineContent: line.trim(),
            lineNumber: index + 1,
            // Можно добавить индексы для подсветки, если нужно
          });
        }
      });

      if (fileMatches.length > 0) {
        groupedResults.push({
          file: file, // Ссылка на объект файла
          filePath: file.path,
          matches: fileMatches,
        });
        // По умолчанию раскрываем файлы, где нашли совпадения
        newExpandedState[file.path] = true;
      }
    });

    setExpandedFiles(newExpandedState);
    setSearchResults(groupedResults);
  };

  const jumpToCode = (file, lineNumber) => {
    openFile(file.path);
    setActiveFile(file.path);
    // setIsSearchOpen(false);

    setTimeout(() => {
      if (editorRef.current) {
        editorRef.current.revealLineInCenter(lineNumber);
        editorRef.current.setPosition({ lineNumber, column: 1 });
        editorRef.current.focus();
      }
    }, 50);
  };

  function registerSaveShortcut(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyS,
      () => {
        handleSave();
      }
    );
  }

  function registerSearchShortcut(editor, monaco) {
    editor.addCommand(
      monaco.KeyMod.CtrlCmd | monaco.KeyMod.Shift | monaco.KeyCode.KeyF,
      () => {
        setIsSearchOpen(true);
        setSearchQuery("");
        setSearchResults([]);
      },
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

    monaco.languages.typescript.javascriptDefaults.setCompilerOptions({
      target: monaco.languages.typescript.ScriptTarget.ES2020,
      allowNonTsExtensions: true,
      moduleResolution: monaco.languages.typescript.ModuleResolutionKind.NodeJs,
      module: monaco.languages.typescript.ModuleKind.CommonJS,
      noEmit: true,
      esModuleInterop: true,
      jsx: monaco.languages.typescript.JsxEmit.React,
      reactNamespace: "React",
      allowJs: true,
      typeRoots: ["node_modules/@types"],
    });

    monaco.languages.typescript.javascriptDefaults.setDiagnosticsOptions({
      noSemanticValidation: false,
      noSyntaxValidation: false,
    });

    if (activeFile) {
      openFile(activeFile);
    } else {
      const defaultFile = files?.find(f => f?.path?.includes("App.jsx"))

      if (defaultFile) {
        openFile(defaultFile.path);
      }
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

    const reactTypes = `
      declare module 'react' {
        export function useState<T>(initialState: T): [T, (newState: T) => void];
        export function useEffect(effect: () => void | (() => void), deps?: any[]): void;
        export function useContext(context: any): any;
        export function createContext(initialValue?: any): any;
        export function useRef<T>(initialValue: T): { current: T };
      }
      declare module 'react-router-dom' {
        export function useNavigate(): (path: string) => void;
        export function useLocation(): { pathname: string, search: string };
        export function useParams(): Record<string, string>;
        export const BrowserRouter: any;
        export const Routes: any;
        export const Route: any;
        export const Link: any;
      }
      declare module 'axios' {
        export const get: (url: string) => Promise<any>;
        export const post: (url: string, data: any) => Promise<any>;
        const axios: any;
        export default axios;
      }
      declare module 'lucide-react' {
        export const Home: any;
        export const User: any;
        // ...
      }
    `;

    monaco.languages.typescript.javascriptDefaults.addExtraLib(
      reactTypes,
      "file:///node_modules/@types/global-libs.d.ts",
    );

    registerSaveShortcut(editor, monaco);
    registerSearchShortcut(editor, monaco);

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
    isSearchOpen,
    searchQuery,
    setSearchQuery,
    setIsSearchOpen,
    searchResults,
    handleGlobalSearch,
    jumpToCode,
    expandedFiles,
    toggleFile,
  };
};
