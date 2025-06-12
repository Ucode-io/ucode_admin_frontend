import {createSlice} from "@reduxjs/toolkit";

export const {actions: groupFieldActions, reducer: groupFieldReducer} =
  createSlice({
    name: "groupField",
    initialState: {
      view: {},
    },
    reducers: {
      setView: (state, {payload}) => {
        state.view = payload;
      },
    },
  });
