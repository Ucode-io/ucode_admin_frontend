import { createSlice } from "@reduxjs/toolkit";

export const { actions: paginationActions, reducer: paginationReducer } = createSlice({
  name: "pagination",
  initialState: {
    paginationInfo: []
  },
  reducers: {
    setTablePages: (state, { payload }) => {
      const { pageLimit, tableSlug } = payload;
      const existingEntryIndex = state.paginationInfo.findIndex(entry => entry.tableSlug === tableSlug);

      if (existingEntryIndex !== -1) {
        state.paginationInfo[existingEntryIndex].pageLimit = pageLimit;
      } else {
        state.paginationInfo.push({ tableSlug, pageLimit });
      }
    }
  },
});
