import {createSlice} from "@reduxjs/toolkit";

export const {actions: paginationActions, reducer: paginationReducer} =
  createSlice({
    name: "pagination",
    initialState: {
      paginationInfo: [],
      sortValues: [],
    },
    reducers: {
      setTablePages: (state, {payload}) => {
        const {pageLimit, tableSlug} = payload;
        const existingEntryIndex = state.paginationInfo.findIndex(
          (entry) => entry.tableSlug === tableSlug
        );

        if (existingEntryIndex !== -1) {
          state.paginationInfo[existingEntryIndex].pageLimit = pageLimit;
        } else {
          state.paginationInfo.push({tableSlug, pageLimit});
        }
      },
      setSortValues: (state, {payload}) => {
        const {tableSlug, field, order} = payload;
        const existingEntryIndex = state.sortValues.findIndex(
          (entry) => entry.tableSlug === tableSlug
        );

        if (existingEntryIndex !== -1) {
          state.sortValues[existingEntryIndex] = {tableSlug, field, order};
        } else {
          state.sortValues.push({tableSlug, field, order});
        }
      },
    },
  });
