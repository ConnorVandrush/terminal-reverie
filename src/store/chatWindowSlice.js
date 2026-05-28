import { createSlice } from "@reduxjs/toolkit";

const chatWindowSlice = createSlice({
  name: "chatWindow",
  initialState: {
    chatMessages: [],
  },
  reducers: {
    clientSendChatMessage: () => {
      // emit handled in chatWindowEmitters.js
    },
    serverBroadcastChatMessage: (state, action) => {
      const { message, sender } = action.payload;
      state.chatMessages.push({ message, sender });
      if (state.chatMessages.length > 100) {
        state.chatMessages.shift();
      }
    },
  },
});

export const { clientSendChatMessage, serverBroadcastChatMessage } =
  chatWindowSlice.actions;
export default chatWindowSlice.reducer;
