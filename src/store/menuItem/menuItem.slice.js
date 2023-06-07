import { createSlice } from "@reduxjs/toolkit";

export const { actions: menuActions, reducer: menuReducer } = createSlice({
  name: "menu",
  initialState: {
    menuItem: {},
  },
  reducers: {
    setMenuItem: (state, { payload }) => {
      state.menuItem = payload ?? {};
    },
  },
});
