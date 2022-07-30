import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: cashboxActions,
  reducer: cashboxReducer
} = createSlice({
  name: "cashbox",
  initialState: {
    data: {},
  },
  reducers: {
    setData: (state, {payload}) => {
      state.data = payload ?? {}
    }
  }
})