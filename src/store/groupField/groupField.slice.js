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
        const {table_slug, relation_table_slug} = payload;
        const isRelation = !!relation_table_slug;

        const existingIndex = state.viewsPath.findIndex(
          (v) =>
            v.table_slug === table_slug &&
            !!v.relation_table_slug === isRelation
        );

        if (existingIndex !== -1) {
          state.viewsPath[existingIndex] = payload;
        } else {
          const sameTableSlugItems = state.viewsPath.filter(
            (v) => v.table_slug === table_slug
          );

          if (sameTableSlugItems.length < 2) {
            state.viewsPath.push(payload);
          } else {
            const relationIndex = state.viewsPath.findIndex(
              (v) =>
                v.table_slug === table_slug && v.relation_table_slug !== null
            );

            if (relationIndex !== -1) {
              state.viewsPath.splice(relationIndex, 1, payload);
            }
          }
        }
      },

      addView: (state, {payload}) => {
        const {table_slug, relation_table_slug} = payload;
        const isRelation = !!relation_table_slug;

        const existingIndex = state.viewsList.findIndex(
          (v) =>
            v.table_slug === table_slug &&
            !!v.relation_table_slug === isRelation
        );

        if (existingIndex !== -1) {
          state.viewsList[existingIndex] = payload;
        } else {
          const sameTableSlugItems = state.viewsList.filter(
            (v) => v.table_slug === table_slug
          );

          if (sameTableSlugItems.length < 2) {
            state.viewsList.push(payload);
          } else {
            const relationIndex = state.viewsList.findIndex(
              (v) =>
                v.table_slug === table_slug && v.relation_table_slug !== null
            );

            if (relationIndex !== -1) {
              state.viewsList.splice(relationIndex, 1, payload);
            }
          }
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

        if (state.viewsPath.length === 0) {
          state.viewsPath = [payload];
          return;
        }

        const index = state.viewsPath.findIndex((v) => v?.id === payload?.id);
        if (index !== -1) {
          state.viewsPath = state.viewsPath.slice(0, index + 1);
        }
      },

      trimViewsDataUntil: (state, {payload}) => {
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
      trimViewsPathUntil: (state, {payload}) => {
        console.log("payload enteredddddd", payload);
        if (!payload) return;

        if (state.viewsPath.length === 0) {
          state.viewsPath = [payload];
          return;
        }

        const index = state.viewsPath.findIndex((v) => v?.id === payload?.id);
        if (index !== -1) {
          state.viewsPath = state.viewsPath.slice(0, index + 1);
        }
      },
    },
  });
