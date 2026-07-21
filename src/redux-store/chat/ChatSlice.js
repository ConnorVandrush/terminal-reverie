import { createSlice } from "@reduxjs/toolkit";

const ChatSlice = createSlice({
  name: "chatSlice",
  initialState: {
    chatMessages: [],
  },
  reducers: {
    clientSendChatMessage: () => {
      // emit handled in ChatSliceEmitters.js
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
  ChatSlice.actions;
export default ChatSlice.reducer;
