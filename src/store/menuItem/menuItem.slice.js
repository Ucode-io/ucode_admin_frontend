import { createSlice } from "@reduxjs/toolkit";

export const { actions: menuActions, reducer: menuReducer } = createSlice({
  name: "menu",
  initialState: {
    menuItem: {},
    menuTemplate: "",
    invite: false,
    activeTable: {},
  },
  reducers: {
    setMenuItem: (state, { payload }) => {
      if (payload.type === "TABLE") state.activeTable = payload;
      state.menuItem = payload ?? {};
    },
    setInvite: (state, { payload }) => {
      state.invite = payload ?? false;
    },
    setMenuLayout: (state, { payload }) => {
      state.menuTemplate = payload ?? {};
    },
    setActiveTable: (state, { payload }) => {
      state.activeTable = payload ?? {};
    },
  },
});
