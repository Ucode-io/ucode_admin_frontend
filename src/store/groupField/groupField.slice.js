import {createSlice} from "@reduxjs/toolkit";

export const {actions: groupFieldActions, reducer: groupFieldReducer} =
  createSlice({
    name: "groupField",
    initialState: {
      viewsList: [],
    },
    reducers: {
      addView: (state, {payload}) => {
        const exists = state.viewsList.some((v) => v.id === payload.id);
        if (!exists) {
          state.viewsList.push(payload);
        }
      },

      setParentView: (state, {payload}) => {
        state.viewsList = state.viewsList.filter((v) => v.id === payload.id);
      },
      clearViews: (state) => {
        state.viewsList = [];
      },
    },
  });
