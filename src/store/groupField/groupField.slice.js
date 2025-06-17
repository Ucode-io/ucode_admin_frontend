import {createSlice} from "@reduxjs/toolkit";

export const {actions: groupFieldActions, reducer: groupFieldReducer} =
  createSlice({
    name: "groupField",
    initialState: {
      views: [],
    },
    reducers: {
      addView: (state, {payload}) => {
        const exists = state.views.some((v) => v.id === payload.id);
        if (!exists) {
          state.views.push(payload);
        }
      },
      cutViewsExceptFirst: (state, {payload}) => {
        state.views.push(payload);
      },
      setViews: (state, {payload}) => {
        state.views = [];
        state.views = payload;
      },
      clearViews: (state) => {
        state.views = [];
      },
    },
  });
