import { createSlice } from "@reduxjs/toolkit";

export const { actions: aiChatActions, reducer: aiChatReducer } = createSlice({
  name: "aiChat",
  initialState: {
    isOpen: false,
    expanded: false,
  },
  reducers: {
    openAiChat: (state) => {
      state.isOpen = true;
    },
    closeAiChat: (state) => {
      state.isOpen = false;
      state.expanded = false;
    },
    toggleAiChat: (state) => {
      state.isOpen = !state.isOpen;
      if (!state.isOpen) state.expanded = false;
    },
    setAiChatOpen: (state, { payload }) => {
      state.isOpen = payload;
      if (!payload) state.expanded = false;
    },
    toggleAiChatExpand: (state) => {
      state.expanded = !state.expanded;
    },
    setAiChatExpanded: (state, { payload }) => {
      state.expanded = payload;
    },
  },
});
