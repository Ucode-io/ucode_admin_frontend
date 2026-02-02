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
      clearMenuChilds: (state) => {
        state.menuChilds = {};
      },
      updateMenuChildById: (state, {payload}) => {
        const {id, children} = payload;
        if (state.menuChilds[id]) {
          state.menuChilds[id] = {...state.menuChilds[id], children};
        }
      },
    },
  });
