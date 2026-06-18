import { createSlice } from "@reduxjs/toolkit";

export const { actions: aiChatActions, reducer: aiChatReducer } = createSlice({
  name: "aiChat",
  initialState: {
    isOpen: false,
  },
  reducers: {
    openAiChat: (state) => {
      state.isOpen = true;
    },
    closeAiChat: (state) => {
      state.isOpen = false;
    },
    toggleAiChat: (state) => {
      state.isOpen = !state.isOpen;
    },
    setAiChatOpen: (state, { payload }) => {
      state.isOpen = payload;
    },
  },
});
