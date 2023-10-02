import { createSlice } from "@reduxjs/toolkit";

export const { actions: paginationActions, reducer: paginationReducer } = createSlice({
  name: "pagination",
  initialState: {
    pagination: 0
  },
  reducers: {
    setTablePage: (state, { payload }) => {
      state.pagination = payload ?? 0;
    },
  },
});
