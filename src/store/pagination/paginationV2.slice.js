import {createSlice} from "@reduxjs/toolkit";

export const {actions: tablePaginationActions, reducer: tablePaginationReducer} =
  createSlice({
    name: "tablePagination",
    initialState: {
      paginationInfo: {},
      sortValues: [],
    },
    reducers: {
      setCurrentPage: (state, {payload}) => {
        const {tableSlug, currentPage} = payload
        state.paginationInfo[tableSlug] = {
          ...state.paginationInfo[tableSlug],
          currentPage
        }
      },

      setLimit: (state, {payload}) => {
        const {tableSlug, limit} = payload
        state.paginationInfo[tableSlug] = {
          ...state.paginationInfo[tableSlug],
          currentPage: 1,
          limit
        }
      },

      setTotalCount: (state, {payload}) => {
        const {tableSlug, totalCount} = payload
        state.paginationInfo[tableSlug] = {
          ...state.paginationInfo[tableSlug],
          totalCount
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
    
      clearSortValues: (state, {payload: {tableSlug}}) => {
        state.sortValues = state.sortValues.filter(
          (item) => item.tableSlug !== tableSlug
        );
      },
    },
  });
