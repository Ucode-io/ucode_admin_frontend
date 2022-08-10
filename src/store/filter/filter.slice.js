import { createSlice } from "@reduxjs/toolkit";

export const { actions: filterAction, reducer: filterReducer } = createSlice({
  name: "filter",
  initialState: {
    list: {},
  },
  reducers: {
    setFilter: (state, { payload: { tableSlug, viewId, name, value } }) => {
      state.list[tableSlug][viewId][name] = value
    },
    clearFilters: (state, { payload: { tableSlug, viewId } }) => {
      state.list[tableSlug][viewId] = {}
    }
  },
});
