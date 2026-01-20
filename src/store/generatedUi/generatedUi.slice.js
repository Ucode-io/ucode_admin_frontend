import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  generatedUi: {
    files: [],
    env: {},
  },
};

export const {actions: generatedUiActions, reducer: generatedUiReducer} = createSlice({
  name: "generatedUi",
  initialState,
  reducers: {
    setGeneratedUi(state, {payload}) {
      state.generatedUi = payload;
    },

    updateFile(state, {payload}) {
      const {index, content} = payload;
      state.generatedUi.files[index].content = content;
    },
  },
});
