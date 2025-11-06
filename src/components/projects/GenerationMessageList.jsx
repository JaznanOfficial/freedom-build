"use client";

import { Response } from "@/components/ai-elements/response";
import { GenerationSceneList } from "./GenerationSceneList";

const GENERATE_SCENES_TOOL_NAME = "generateScenes";
const SCENE_TOOL_PART_TYPE = `tool-${GENERATE_SCENES_TOOL_NAME}`;
const DEFAULT_SCENE_STATUS_MESSAGE = "I'm generating your video scenes now.";

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

function isSceneArray(value) {
  if (!Array.isArray(value) || value.length === 0) {
    return false;
  }

  return value.every((item) => item && typeof item === "object" && "scene_serial" in item && "prompt" in item);
}

function tryParseJSON(text) {
  const trimmed = text.trim();
  const firstChar = trimmed[0];
  if (firstChar !== "{" && firstChar !== "[") {
    return null;
  }

  try {
    return JSON.parse(trimmed);
  } catch {
    return null;
  }
}

function scanObjectValues(objectValue, seen) {
  for (const key of Object.keys(objectValue)) {
    const scenes = findScenesDeep(objectValue[key], seen);
    if (scenes) {
      return scenes;
    }
  }

  return null;
}

function findScenesDeep(value, seen = new Set()) {
  if (value == null) {
    return null;
  }

  if (typeof value === "string") {
    const parsed = tryParseJSON(value);
    return parsed ? findScenesDeep(parsed, seen) : null;
  }

  if (typeof value !== "object") {
    return null;
  }

  if (seen.has(value)) {
    return null;
  }
  seen.add(value);

  if (isSceneArray(value)) {
    return value;
  }

  if (Array.isArray(value)) {
    for (const item of value) {
      const scenes = findScenesDeep(item, seen);
      if (scenes) {
        return scenes;
      }
    }
    return null;
  }

  if (Array.isArray(value.scenes)) {
    return value.scenes;
  }

  return scanObjectValues(value, seen);
}

function extractScenes(message) {
  return findScenesDeep(message);
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

function partsIncludeSceneTool(parts) {
  if (!Array.isArray(parts)) {
    return false;
  }

  for (const part of parts) {
    if (!part) {
      continue;
    }

    if (
      part.type === SCENE_TOOL_PART_TYPE ||
      ((part.type === "tool-call" || part.type === "tool-result" || part.type === "tool-error") &&
        part.toolName === GENERATE_SCENES_TOOL_NAME)
    ) {
      return true;
    }

    if (Array.isArray(part.parts) && partsIncludeSceneTool(part.parts)) {
      return true;
    }
  }

  return false;
}

function hasSceneToolActivity(message) {
  if (!message || message.role !== "assistant") {
    return false;
  }

  if (partsIncludeSceneTool(message.parts)) {
    return true;
  }

  if (partsIncludeSceneTool(message.content)) {
    return true;
  }

  if (Array.isArray(message.toolInvocations)) {
    return message.toolInvocations.some(
      (invocation) => invocation?.toolName === GENERATE_SCENES_TOOL_NAME,
    );
  }

  return false;
}

function resolveAssistantContent({ isUser, content, scenes, sceneToolActive }) {
  if (isUser || content) {
    return content;
  }

  if (sceneToolActive || Boolean(scenes?.length)) {
    return DEFAULT_SCENE_STATUS_MESSAGE;
  }

  return content;
}

export function GenerationMessageList({ messages }) {
  if (!Array.isArray(messages) || messages.length === 0) {
    return null;
  }

  return messages.flatMap((message) => {
    const isUser = message.role === "user";
    const bubbles = [];

    let content = extractTextContent(message);
    const scenes = isUser ? null : extractScenes(message);
    const sceneToolActive = isUser ? false : hasSceneToolActivity(message);

    content = resolveAssistantContent({ isUser, content, scenes, sceneToolActive });

    if (content) {
      bubbles.push(buildTextBubble(message.id, content, isUser));
    }

    if (!isUser && scenes) {
      bubbles.push(buildSceneBubble(message.id, scenes));
    }

    return bubbles;
  });
}
