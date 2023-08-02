import { createSlice } from "@reduxjs/toolkit";

export const { actions: languagesActions, reducer: languagesReducer } = createSlice({
  name: "languages",
  initialState: {
    list: [],
  },
  reducers: {
    setLanguagesItems: (state, { payload }) => {
      state.list = payload ?? [];
    },
  },
});
