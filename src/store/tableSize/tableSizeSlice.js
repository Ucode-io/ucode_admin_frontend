import { createSlice } from "@reduxjs/toolkit";

export const { actions: tableSizeAction, reducer: tableSizeReducer } = createSlice({
  name: "tableSize",
  initialState: {
    tableSize: {}
  },
  reducers: {
    setTableSize: (state, {payload: {pageName, colSlug, colWidth}}) => {
      state.tableSize[pageName] = state.tableSize[pageName] || {};
      state.tableSize[pageName][colSlug] = colWidth;
    }
  },
});
