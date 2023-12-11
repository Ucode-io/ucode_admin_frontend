import {createSlice} from "@reduxjs/toolkit";

export const {actions: environmentActions, reducer: environmentReducer} =
  createSlice({
    name: "environment",
    initialState: {
      environmentList: [],
    },
    reducers: {
      setEnvironment: (state, {payload}) => {
        state.environmentList = payload;
      },
    },
  });
