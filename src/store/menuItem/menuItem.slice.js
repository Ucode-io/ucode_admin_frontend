import { createSlice } from "@reduxjs/toolkit";

export const { actions: menuActions, reducer: menuReducer } = createSlice({
  name: "menu",
  initialState: {
    menuItem: {},
    menuTemplate: "",
  },
  reducers: {
    setMenuItem: (state, { payload }) => {
      state.menuItem = payload ?? {};
    },
    setMenuLayout: (state, { payload }) => {
      state.menuTemplate = payload ?? {};
    },
  },
});
