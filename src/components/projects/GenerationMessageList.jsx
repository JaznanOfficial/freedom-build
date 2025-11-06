"use client";

import { Response } from "@/components/ai-elements/response";
import { GenerationSceneList } from "./GenerationSceneList";

const GENERATE_SCENES_TOOL_NAME = "generateScenes";

function extractTextContent(message) {
  if (Array.isArray(message.parts)) {
    return message.parts
      .filter((part) => part?.type === "text" && typeof part.text === "string")
      .map((part) => part.text)
      .join("");
  }

  if (typeof message.content === "string") {
    return message.content;
  }

  return "";
}

function parseScenesFromPayload(payload) {
  if (!payload) {
    return null;
  }

  let current = payload;

  while (current && typeof current === "object" && ("output" in current || "result" in current)) {
    current = current.output ?? current.result;
  }

  if (Array.isArray(current)) {
    return current;
  }

  if (Array.isArray(current?.scenes)) {
    return current.scenes;
  }

  if (typeof current === "string") {
    try {
      const parsed = JSON.parse(current);
      if (Array.isArray(parsed)) {
        return parsed;
      }
      if (Array.isArray(parsed?.scenes)) {
        return parsed.scenes;
      }
    } catch {
      return null;
    }
  }

  return null;
}

function gatherFromToolInvocations(toolInvocations) {
  if (!Array.isArray(toolInvocations)) {
    return [];
  }

  return toolInvocations
    .filter((invocation) => invocation?.toolName === GENERATE_SCENES_TOOL_NAME)
    .filter((invocation) => !invocation?.state || invocation.state === "result")
    .map((invocation) => invocation.result ?? invocation.output ?? invocation.data ?? invocation);
}

function gatherFromToolParts(parts) {
  if (!Array.isArray(parts)) {
    return [];
  }

  return parts
    .filter((part) => part?.type === "tool-result" && part?.toolName === GENERATE_SCENES_TOOL_NAME)
    .map((part) => part.result ?? part.output ?? part.data ?? part.content ?? part);
}

function gatherInvocationPayloads(message) {
  return [...gatherFromToolInvocations(message.toolInvocations), ...gatherFromToolParts(message.parts)];
}

function extractScenes(message) {
  const payloads = gatherInvocationPayloads(message);

  for (const payload of payloads) {
    const scenes = parseScenesFromPayload(payload);
    if (Array.isArray(scenes) && scenes.length > 0) {
      return scenes;
    }
  }

  return null;
}

function buildSceneBubble(messageId, scenes) {
  return (
    <div className="flex justify-start" key={`${messageId}-scenes`}>
      <div className="max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2 text-foreground text-sm">
        <GenerationSceneList scenes={scenes} />
      </div>
    </div>
  );
}

function buildTextBubble(messageId, content, isUser) {
  const alignment = isUser ? "justify-end" : "justify-start";
  const tone = isUser ? "bg-primary/10 text-primary" : "bg-muted text-foreground";

  return (
    <div className={`flex ${alignment}`} key={`${messageId}-text`}>
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
    const isUser = message.role === "user";
    const bubbles = [];

    if (!isUser) {
      const scenes = extractScenes(message);
      if (scenes) {
        bubbles.push(buildSceneBubble(message.id, scenes));
      }
    }

    const content = extractTextContent(message);
    if (content) {
      bubbles.push(buildTextBubble(message.id, content, isUser));
    }

    return bubbles;
  });
}
