import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: projectInfoActions,
  reducer: projectInfoReducer
} = createSlice({
  name: "projectInfo",
  initialState: {
    projectInfo: null,
    menuItem: null,
  },
  reducers: {
    setProjectInfo: (state, action) => {
      state.projectInfo = action.payload
    },
    setMenuItem: (state, action) => {
      state.menuItem = action.payload
    },
  },
})
