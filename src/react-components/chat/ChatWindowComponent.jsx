import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clientSendChatMessage } from "@store/chat/ChatSlice.js";

import styles from "./ChatWindowComponent.module.css";

export default function ChatWindowComponent() {
  const dispatch = useDispatch();
  const chatMessageRef = useRef();
  const messagesEndRef = useRef();
  const chatMessages = useSelector((state) => state.ChatSlice.chatMessages);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "auto" });
  }, [chatMessages]);

  function handleClientSendMessage() {
    dispatch(clientSendChatMessage(chatMessageRef.current.value));
    chatMessageRef.current.value = "";
  }

  function renderChatMessages() {
    if (chatMessages && chatMessages.length > 0) {
      return chatMessages.map((msg, index) => (
        <div key={index} className={styles.chatMessage}>
          <span className={styles.chatName}>{msg.sender}:</span>
          <span className={styles.chatText}>{msg.message}</span>
        </div>
      ));
    }
  }

  return (
    <div className={styles.chatWindow}>
      <div className={styles.messagesContainer}>
        <div style={{ marginTop: "auto" }} />
        {renderChatMessages()}
        <div ref={messagesEndRef} />
      </div>

      <div className={styles.inputRow}>
        <input
          type="text"
          placeholder="Type a message..."
          ref={chatMessageRef}
        />
        <button onClick={handleClientSendMessage}>Send</button>
      </div>
    </div>
  );
}
