import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  generatedUi: {
    project_files: [],
    project_env: {},
    id: "",
  },
};

export const { actions: generatedUiActions, reducer: generatedUiReducer } =
  createSlice({
    name: "generatedUi",
    initialState,
    reducers: {
      setGeneratedUi(state, { payload }) {
        state.generatedUi = payload;
      },

      updateFile(state, { payload }) {
        const { index, content } = payload;
        state.generatedUi.project_files[index].content = content;
      },

      resetGeneratedUi(state) {
        state.generatedUi = initialState.generatedUi;
      },
    },
  });
