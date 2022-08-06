import { createSlice } from "@reduxjs/toolkit";

export const { actions: filterAction, reducer: filterReducer } = createSlice({
  name: "filter",
  initialState: {
    filters: {},
  },
  reducers: {
    setFilters: (state, { payload: { name, value } }) => {
      state.filters[name] = value;
    },
    clearFilters: (state) => {
      state.filters = {};
    }
  },
});
