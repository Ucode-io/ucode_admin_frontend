import {createSlice} from "@reduxjs/toolkit";

const initialState = {
  openDrawer: false,
  mainTabIndex: 0,
  drawerTabIndex: 0,
  tableInfo: null,
  selectedView: {},
  defaultValue: null,
};

export const { actions: detailDrawerActions, reducer: detailDrawerReducer } =
  createSlice({
    name: "detailDrawer",
    initialState,
    reducers: {
      setMainTabIndex: (state, action) => {
        state.mainTabIndex = action.payload;
      },
      setInitialTableInfo: (state, action) => {
        state.tableInfo = action.payload;
      },
      setDrawerTabIndex: (state, action) => {
        state.drawerTabIndex = action.payload;
      },
      setSelectedView: (state, action) => {
        state.selectedView = action.payload;
      },
      openDrawer: (state) => {
        state.openDrawer = true;
      },
      closeDrawer: (state) => {
        state.openDrawer = false;
        state.defaultValue = null;
      },
      setDefaultValue: (state, action) => {
        state.defaultValue = action.payload;
      },
      reset: () => {
        return initialState;
      },
    },
  });
