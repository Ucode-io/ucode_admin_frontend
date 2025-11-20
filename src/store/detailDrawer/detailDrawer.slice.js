import {createSlice} from "@reduxjs/toolkit";

export const { actions: detailDrawerActions, reducer: detailDrawerReducer } =
  createSlice({
    name: "detailDrawer",
    initialState: {
      openDrawer: false,
      mainTabIndex: 0,
      drawerTabIndex: 0,
      tableInfo: null,
      selectedView: {},
    },
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
      },
    },
  });
