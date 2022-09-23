import { createSlice } from "@reduxjs/toolkit"

export const { actions: filterActions, reducer: filterReducer } = createSlice({
  name: "filter",
  initialState: {
    list: {},
    new_list: {},
  },
  reducers: {
    setFilter: (state, { payload: { tableSlug, viewId, name, value } }) => {
      if (!state.list[tableSlug]) state.list[tableSlug] = {}
      if (!state.list[tableSlug][viewId]) state.list[tableSlug][viewId] = {}
      state.list[tableSlug][viewId][name] = value
    },
    setNewFilter: (state, { payload: { tableSlug, viewId, name, value } }) => {
      if (!state.new_list[tableSlug]) state.new_list[tableSlug] = {}
      if (!state.new_list[tableSlug][viewId])
        state.new_list[tableSlug][viewId] = {}
      state.new_list[tableSlug][viewId][name] = value
    },
    clearFilters: (state, { payload: { tableSlug, viewId } }) => {
      if (state.list[tableSlug]?.[viewId]?.order) {
        state.list[tableSlug][viewId] = {
          order: state.list[tableSlug][viewId].order,
        }
      } else {
        state.list[tableSlug][viewId] = {}
      }
    },
    clearOrders: (state, { payload: { tableSlug, viewId } }) => {
      state.list[tableSlug][viewId].order = {}
    },
  },
})
