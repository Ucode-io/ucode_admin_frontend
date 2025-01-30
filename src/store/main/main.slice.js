import {createSlice} from "@reduxjs/toolkit";

export const {actions: mainActions, reducer: mainReducer} = createSlice({
  name: "tableColumn",
  initialState: {
    settingsSidebarIsOpen: true,
    pinIsEnabled: false,
    subMenuIsOpen: false,
    sidebarShowTooltip: false,
    sidebarHighlightedMenu: null,
    sidebarHighlightedAction: null
  },
  reducers: {
    setSettingsSidebarIsOpen: (state, {payload}) => {
      state.settingsSidebarIsOpen = payload;
    },
    setPinIsEnabled: (state, {payload}) => {
      state.pinIsEnabled = payload;
    },
    setSubMenuIsOpen: (state, { payload }) => {
      state.subMenuIsOpen = payload;
    },
    setSidebarHighlightedMenu: (state, {payload}) => {
      state.sidebarHighlightedMenu = payload;
    },
    setSidebarHighlightedAction: (state, {payload}) => {
      state.sidebarHighlightedAction = payload;
    }
  },
});
