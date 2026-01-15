import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  openedFiles: [],
  activeFile: null,
};

export const {actions: editorActions, reducer: codeEditorReducer} = createSlice({
  name: "editor",
  initialState,
  reducers: {
    setOpenedFiles(state, {payload}) {
      state.openedFiles = payload;
    },
    setActiveFile(state, {payload}) {
      state.activeFile = payload;
    },
  },
});
