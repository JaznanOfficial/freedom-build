"use client";

import { createContext, useContext } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";

const ChatContext = createContext(null);

export function ChatProvider({ children }) {
  const chat = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  return <ChatContext.Provider value={chat}>{children}</ChatContext.Provider>;
}

export function useProjectChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useProjectChat must be used within a ChatProvider");
  }
  return context;
}
