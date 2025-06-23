import {createSlice} from "@reduxjs/toolkit";

export const {actions: groupFieldActions, reducer: groupFieldReducer} =
  createSlice({
    name: "groupField",
    initialState: {
      viewsList: [],
      viewsPath: [],
    },
    reducers: {
      addViewPath: (state, {payload}) => {
        const exists = state.viewsPath.some((v) => v === payload);
        if (!exists) {
          state.viewsPath.push(payload);
        }
      },
      addView: (state, {payload}) => {
        const exists = state.viewsList.some(
          (v) => v?.table_slug === payload?.table_slug
        );
        if (!exists) {
          state.viewsList.push(payload);
        } else {
          state.viewsList = state.viewsList.map((v) =>
            v?.table_slug === payload?.table_slug ? payload : v
          );
        }
      },

      clearViews: (state) => {
        state.viewsList = [];
      },
      clearViewsPath: (state) => {
        state.viewsPath = [];
      },
      trimViewsUntil: (state, {payload}) => {
        if (!payload) return;

        if (state.viewsList.length === 0) {
          state.viewsList = [payload];
          return;
        }

        const index = state.viewsList.findIndex((v) => v?.id === payload?.id);
        if (index !== -1) {
          state.viewsList = state.viewsList.slice(0, index + 1);
        }
      },
    },
  });
