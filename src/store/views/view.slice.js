import {createSlice} from "@reduxjs/toolkit";

export const {actions: viewsActions, reducer: viewsReducer} = createSlice({
  name: "views",
  initialState: {
    viewTab: [],
    views: [],
    selectedView: {
      index: null,
      view: {}
    },
  },
  reducers: {
    setViewTab: (state, {payload}) => {
      const {tableSlug, tabIndex} = payload;
      const existingEntryIndex = state.viewTab.findIndex(
        (entry) => entry.tableSlug === tableSlug
      );

      if (existingEntryIndex !== -1) {
        state.viewTab[existingEntryIndex].tabIndex = tabIndex;
      } else {
        state.viewTab.push({tableSlug, tabIndex});
      }
    },
    setViews: (state, {payload}) => {
      state.views = payload
    },
    updateView: (state, {payload}) => {
      const {view, index, id} = payload;
      if(id) {
        state.views = state.views.map(v => v.id === id ? view : v)
      } else {
        state.views[index] = view
      }
    },
    setSelectedView: (state, {payload}) => {
      state.selectedView = payload
    },
  },
});
