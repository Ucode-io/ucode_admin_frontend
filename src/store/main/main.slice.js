import {createSlice} from "@reduxjs/toolkit";

export const { actions: mainActions, reducer: mainReducer } = createSlice({
  name: "tableColumn",
  initialState: {
    settingsSidebarIsOpen: true,
    pinIsEnabled: false,
    subMenuIsOpen: false,
    sidebarHighlightedMenu: null,
    sidebarHighlightedAction: null,
    tableViewFiltersOpen: true,
    selectedViewType: "SidePeek",
  },
  reducers: {
    setSettingsSidebarIsOpen: (state, { payload }) => {
      state.settingsSidebarIsOpen = payload;
    },
    setPinIsEnabled: (state, { payload }) => {
      state.pinIsEnabled = payload;
    },
    setSubMenuIsOpen: (state, { payload }) => {
      state.subMenuIsOpen = payload;
    },
    setSidebarHighlightedMenu: (state, { payload }) => {
      state.sidebarHighlightedMenu = payload;
    },
    setSidebarHighlightedAction: (state, { payload }) => {
      state.sidebarHighlightedAction = payload;
    },
    setTableViewFiltersOpen: (state, { payload }) => {
      state.tableViewFiltersOpen = payload;
    },
    setSelectedViewType: (state, action) => {
      state.selectedViewType = action.payload;
    },
  },
});
