import {createSlice} from "@reduxjs/toolkit";

export const {actions: menuAccordionActions, reducer: menuAccordionReducer} =
  createSlice({
    name: "menu",
    initialState: {
      menuChilds: {},
    },
    reducers: {
      toggleMenuChilds: (state, {payload}) => {
        state.menuChilds = payload;
      },
    },
  });
