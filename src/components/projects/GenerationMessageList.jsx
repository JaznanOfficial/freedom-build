"use client";

import { Response } from "@/components/ai-elements/response";
import { GenerationSceneList } from "./GenerationSceneList";

const DEFAULT_SCENE_STATUS_MESSAGE = "Jaznan is generating your videos. Hold tight and enjoy...";

function hasScenes(message) {
  return Array.isArray(message?.scenes) && message.scenes.length > 0;
}

function getDisplayContent(message) {
  if (typeof message?.content === "string" && message.content.trim().length > 0) {
    return message.content;
  }

  if (message?.role === "assistant" && hasScenes(message)) {
    return DEFAULT_SCENE_STATUS_MESSAGE;
  }

  return "";
}

function buildSceneBubble(message, scenes) {
  return (
    <div className="flex justify-start" key={`${message.id}-scenes`}>
      <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-foreground text-sm">
        <GenerationSceneList scenes={scenes} />
      </div>
    </div>
  );
}

function buildTextBubble(message, content) {
  const isUser = message.role === "user";
  const alignment = isUser ? "justify-end" : "justify-start";
  const tone = isUser ? "bg-primary/10 text-primary" : "bg-muted text-foreground";

  return (
    <div className={`flex ${alignment}`} key={`${message.id}-text`}>
      <div className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${tone}`}>
        {isUser ? content : <Response>{content}</Response>}
      </div>
    </div>
  );
}

export function GenerationMessageList({ messages }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return messages.flatMap((message) => {
    const content = getDisplayContent(message);
    const bubbles = [];

    if (content) {
      bubbles.push(buildTextBubble(message, content));
    }

    if (message.role !== "user" && hasScenes(message)) {
      bubbles.push(buildSceneBubble(message, message.scenes));
    }

    return bubbles;
  });
}
