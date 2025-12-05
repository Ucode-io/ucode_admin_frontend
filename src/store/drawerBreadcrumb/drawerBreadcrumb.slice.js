import {createSlice} from "@reduxjs/toolkit";

export const {actions: drawerBreadcrumbActions, reducer: drawerBreadcrumbReducer} =
  createSlice({
    name: "drawerBreadcrumb",
    initialState: {
      tables: [],
      tableViews: [],
      activeTable: {},


      viewsList: [],
      viewsPath: [],
      groupByFieldSlug: "",
    },
    reducers: {
      addTable: (state, {payload}) => {
        if(!payload) return;
        state.tables.push(payload);
        state.activeTable = payload;
      },
      // addTableView: (state, {payload}) => {
      //   const { id } = payload
      //   state.tableViews[id] = payload
      // },
      goToTable: (state, {payload}) => {

        if(payload.index === state.tables.length - 1) return;

        if(payload.index === 0) {
          state.tables = [payload];
          return;
        }

        state.activeTable = payload
        state.tables = state.tables.slice(0, payload.index + 1)
      },

      clearTable: (state) => {
        state.tables = [];
        state.activeTable = {};
      },


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

      addGroupBySlug: (state, {payload}) => {
        state.groupByFieldSlug = payload;
      },
      clearGroupBySlug: (state) => {
        state.groupByFieldSlug = "";
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
      clearViews: (state) => {
        state.viewsList = [];
      },
      clearViewsPath: (state) => {
        state.viewsPath = [];
      },
    },
  });
