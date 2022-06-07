import { createSlice } from "@reduxjs/toolkit"

export const {
  actions: tabRouteActions,
  reducer: tabRouteReducer
} = createSlice({
  name: "tabRoute",
  initialState: {
    list: [
      {
        id: 123,
        history: [
          {
            
          }
        ]
      }
    ],
  },
  reducers: {},
})