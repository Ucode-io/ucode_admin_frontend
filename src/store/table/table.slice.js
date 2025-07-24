import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: tableActions,
  reducer: tableReducer
} = createSlice({
  name: "table",
  initialState: {
    activeTable: {},
  },
  reducers: {
    setTable: (state, action) => {
      state.activeTable = action.payload
    },
    removeTable: (state) => {
      state.activeTable = {}
    },
    clear: (state) => {
      state.activeTable = {}
    }
  },
})