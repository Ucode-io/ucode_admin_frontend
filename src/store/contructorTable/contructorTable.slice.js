import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: contructorTableActions,
  reducer: contructorTableReducer
} = createSlice({
  name: "contructorTable",
  initialState: {
    list: [],
    loader: false,
  },
  reducers: {
    setList: (state, {payload}) => {
      state.list = payload ?? []
    },
    add: (state, { payload }) => {
      state.list.unshift(payload)
    },
    setDataById: (state, { payload }) => {
      const index = state.list.findIndex(item => item.id === payload.id)
      state.list[index] = payload
    },
    delete: (state, { payload }) => {
      const index = state.list.findIndex(item => item.id === payload)
      state.list.splice(index, 1)
    },
    setLoader: (state, { payload }) => {
      state.loader = payload
    }
  },
  // extraReducers: {
  //   [fetchContructorTableListAction.fulfilled]: (state, { payload }) => {
  //     state.list = payload ?? []
  //   }
  // }
})