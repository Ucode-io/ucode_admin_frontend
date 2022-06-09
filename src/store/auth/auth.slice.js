import { createSlice } from "@reduxjs/toolkit"


export const {
  actions: authActions,
  reducer: authReducer
} = createSlice({
  name: "auth",
  initialState: {
    isAuthorizated: false
  },
  reducers: {
    login: (state) => {
      state.isAuthorizated = true
    },
    logout: (state) => {
      state.isAuthorizated = false
    }
  }
})
