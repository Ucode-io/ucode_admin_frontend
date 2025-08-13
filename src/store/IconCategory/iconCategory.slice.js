import {createSlice} from "@reduxjs/toolkit";

export const {actions: iconCategoryActions, reducer: iconCategoryReducer} =
  createSlice({
    name: "category",
    initialState: {
      iconCategories: [],
    },
    reducers: {
      setCategories: (state, {payload}) => {
        state.iconCategories = payload ?? [];
      },
    },
  });
