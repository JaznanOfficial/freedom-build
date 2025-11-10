"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const ChatContext = createContext(null);

const DEFAULT_SCENE_STATUS_MESSAGE =
  "Jaznan is getting ready to generate scenes once the new backend is connected.";

const PLACEHOLDER_SCENES = [
  {
    scene_serial: 1,
    prompt: "Introduce the product with a captivating hero shot and bold headline overlay.",
    duration: 6,
    aspect_ratio: "16:9",
    resolution: "1080p",
    status: "pending",
  },
  {
    scene_serial: 2,
    prompt: "Showcase key features in an engaging sequence with upbeat background music.",
    duration: 8,
    aspect_ratio: "16:9",
    resolution: "1080p",
    status: "pending",
  },
  {
    scene_serial: 3,
    prompt: "Close with a compelling call-to-action and brand lockup animation.",
    duration: 6,
    aspect_ratio: "16:9",
    resolution: "1080p",
    status: "pending",
  },
];

const RANDOM_SLICE_START = 2;
const PLACEHOLDER_RESPONSE_DELAY_MS = 400;
const HEX_RADIX = 16;

function generateMessageId() {
  return `${Date.now()}-${Math.random().toString(HEX_RADIX).slice(RANDOM_SLICE_START)}`;
}

export function ChatProvider({ children }) {
  const [messages, setMessages] = useState([]);
  const [status, setStatus] = useState("idle");

  const sendMessage = useCallback((text) => {
    const trimmed = text.trim();
    if (!trimmed) {
      return;
    }

    const userMessage = {
      id: generateMessageId(),
      role: "user",
      content: trimmed,
    };

    setMessages((previous) => [...previous, userMessage]);
    setStatus("streaming");

    const assistantMessage = {
      id: generateMessageId(),
      role: "assistant",
      content: DEFAULT_SCENE_STATUS_MESSAGE,
      scenes: PLACEHOLDER_SCENES,
    };

    window.setTimeout(() => {
      setMessages((previous) => [...previous, assistantMessage]);
      setStatus("idle");
    }, PLACEHOLDER_RESPONSE_DELAY_MS);
  }, []);

  const value = useMemo(
    () => ({ messages, sendMessage, status }),
    [messages, sendMessage, status],
  );

  return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
}

export function useProjectChat() {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useProjectChat must be used within a ChatProvider");
  }
  return context;
}
