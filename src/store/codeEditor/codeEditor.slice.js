import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  openedFiles: [],
  activeFile: null,
  changedFiles: [],
  expandedFolders: {},
};

export const { actions: editorActions, reducer: codeEditorReducer } =
  createSlice({
    name: "editor",
    initialState,
    reducers: {
      setOpenedFiles(state, { payload }) {
        state.openedFiles = payload;
      },

      setActiveFile(state, { payload }) {
        state.activeFile = payload;
      },

      addChangedFile(state, { payload }) {
        state.changedFiles.push(payload);
      },

      removeChangedFile(state, { payload }) {
        state.changedFiles = state.changedFiles.filter(
          (file) => file !== payload,
        );
      },

      toggleFolder(state, { payload: path }) {
        const next = state.expandedFolders;
        if (next[path]) delete next[path];
        else next[path] = path;

        state.expandedFolders = next;
      },

      resetCodeEditor() {
        return initialState;
      },
    },
  });
