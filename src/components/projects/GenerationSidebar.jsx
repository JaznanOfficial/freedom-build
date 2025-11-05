"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { Paperclip, Send, Settings } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { sceneSchema } from "@/app/api/chat/schema";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

let fallbackIdCounter = 0;

function generateId() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  fallbackIdCounter += 1;
  return `id-${fallbackIdCounter}`;
}

const DEFAULT_ASPECT_RATIO = "16:9";
const DEFAULT_PROJECT_ID = "default-project";

function formatSceneSummary(scene) {
  if (!scene || typeof scene !== "object") {
    return null;
  }
  const prompt = scene.prompt ?? "";
  const parts = [];
  if (scene.duration) {
    parts.push(`${scene.duration}s`);
  }
  parts.push(scene.aspect_ratio ?? DEFAULT_ASPECT_RATIO);
  const suffix = parts.length > 0 ? ` (${parts.join(" ")})` : "";
  const summary = `${prompt}${suffix}`.trim();
  return summary ? summary : null;
}

function buildHistoryEntries(conversation) {
  const entries = [];
  for (const entry of conversation) {
    if (entry.role === "user" && entry.content) {
      entries.push(`User: ${entry.content}`);
      continue;
    }

    if (entry.role !== "assistant") {
      continue;
    }

    if (entry.scenes && entry.scenes.length > 0) {
      const summaries = entry.scenes.map(formatSceneSummary).filter(Boolean);
      if (summaries.length > 0) {
        entries.push(`Assistant Scenes: ${summaries.join("; ")}`);
      }
      continue;
    }

    if (entry.content) {
      entries.push(`Assistant: ${entry.content}`);
    }
  }
  return entries;
}

function logObject(label, value) {
  const logger = globalThis?.console;
  logger?.log?.(label, value);
}

function resolveMessageDetails(message, persistScenes) {
  if (message.role === "user") {
    return {
      key: message.id,
      alignment: "justify-end",
      bubbleClass:
        "max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary/10 px-3 py-2 text-primary",
      content: message.content ?? "",
    };
  }

  const scenes = Array.isArray(message.scenes) ? message.scenes : [];

  if (scenes.length > 0) {
    persistScenes(message.id, scenes, message.projectId);
    return {
      key: message.id,
      alignment: "justify-start",
      bubbleClass: "max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2",
      content: <SceneList scenes={scenes} />,
    };
  }

  if (message.content) {
    return {
      key: message.id,
      alignment: "justify-start",
      bubbleClass: "max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2",
      content: <Response>{message.content}</Response>,
    };
  }

  return null;
}

function SceneList({ scenes }) {
  return (
    <div className="space-y-2">
      {scenes.map((scene) => (
        <div
          className="rounded-lg border border-muted bg-background px-3 py-2"
          key={`${scene.scene_serial}-${scene.prompt}`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Scene {scene.scene_serial}</span>
            <span>{scene.duration}s</span>
          </div>
          <div className="mt-1 font-medium text-foreground text-sm">
            {scene.prompt}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-muted-foreground text-xs">
            <span className="rounded bg-muted px-1.5 py-0.5">
              {scene.aspect_ratio ?? "16:9"}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5">
              {scene.resolution ?? "1080p"}
            </span>
            <span className="rounded bg-muted px-1.5 py-0.5 capitalize">
              {scene.status ?? "pending"}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

export function GenerationSidebar({ className }) {
  const [text, setText] = useState("");
  const [conversation, setConversation] = useState([]);
  const persistedSceneMessages = useRef(new Set());
  const lastAssistantMessageId = useRef(null);
  const { object, submit, isLoading, error, clear, stop } = useObject({
    api: "/api/chat",
    schema: sceneSchema,
  });

  const isStreaming = isLoading;
  const trimmedText = text.trim();

  const persistScenes = useCallback((messageId, scenes, projectId) => {
    if (persistedSceneMessages.current.has(messageId)) {
      return;
    }
    persistedSceneMessages.current.add(messageId);

    queueMicrotask(() => {
      const requests = scenes.map((scene, index) =>
        fetch("/api/video/scenes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            project_id: projectId ?? scene.project_id ?? DEFAULT_PROJECT_ID,
            scene_serial: scene.scene_serial ?? index + 1,
            prompt: scene.prompt,
            status: scene.status ?? "pending",
            duration: scene.duration,
            aspect_ratio: scene.aspect_ratio ?? "16:9",
            resolution: scene.resolution ?? "1080p",
            reference_image: scene.reference_image ?? null,
            last_image: scene.last_image ?? null,
            video_url: scene.video_url ?? null,
          }),
        })
      );
      Promise.allSettled(requests);
    });
  }, []);

  const handleSend = useCallback(() => {
    if (!trimmedText || isStreaming) {
      return;
    }
    clear();
    stop();

    const userMessageId = generateId();
    const assistantMessageId = generateId();

    lastAssistantMessageId.current = assistantMessageId;

    const history = buildHistoryEntries(conversation);

    setConversation((prev) => [
      ...prev,
      { id: userMessageId, role: "user", content: trimmedText },
      {
        id: assistantMessageId,
        role: "assistant",
        content: "",
        scenes: [],
        projectId: null,
      },
    ]);

    submit({
      prompt: trimmedText,
      history,
    });
    setText("");
  }, [clear, conversation, isStreaming, stop, submit, trimmedText]);

  useEffect(() => {
    if (!object) {
      return;
    }

    const assistantId = lastAssistantMessageId.current;
    if (!assistantId) {
      return;
    }

    logObject("Generated scenes object:", object);

    const rawScenes = Array.isArray(object.scenes)
      ? object.scenes.filter((scene) => scene && typeof scene === "object")
      : [];
    const projectId = rawScenes.find((scene) => scene?.project_id)?.project_id;

    setConversation((prev) => {
      let changed = false;
      const next = prev.map((message) => {
        if (message.id !== assistantId) {
          return message;
        }
        const previousScenes = message.scenes ?? [];
        const sameLength = previousScenes.length === rawScenes.length;
        const sameScenes =
          sameLength &&
          previousScenes.every((scene, index) => {
            const current = rawScenes[index];
            return JSON.stringify(scene) === JSON.stringify(current);
          });
        if (sameScenes) {
          return message;
        }
        changed = true;
        return {
          ...message,
          scenes: rawScenes,
          projectId: message.projectId ?? projectId ?? null,
        };
      });
      return changed ? next : prev;
    });

    if (rawScenes.length > 0) {
      persistScenes(assistantId, rawScenes, projectId);
    }
  }, [object, persistScenes]);

  useEffect(() => {
    if (!error) {
      return;
    }

    const assistantId = lastAssistantMessageId.current;
    const errorMessage = error.message ?? "Something went wrong";

    if (!assistantId) {
      return;
    }

    setConversation((prev) =>
      prev.map((message) =>
        message.id === assistantId
          ? { ...message, content: errorMessage, scenes: [] }
          : message,
      ),
    );
  }, [error]);

  const renderedMessages = conversation
    .map((message) => resolveMessageDetails(message, persistScenes))
    .filter((details) => details !== null);

  return (
    <aside className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-medium text-foreground text-sm">
              Conversation
            </span>
          </div>
          <StickToBottom
            className="flex-1 overflow-y-auto"
            initial="smooth"
            resize="smooth"
          >
            <StickToBottom.Content className="space-y-3 p-3 text-sm">
              {renderedMessages.length === 0 ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                    Start ideating scenes here. This area will display the
                    latest chat updates.
                  </div>
                </div>
              ) : (
                renderedMessages.map((details) => (
                  <div className={`flex ${details.alignment}`} key={details.key}>
                    <div className={details.bubbleClass}>{details.content}</div>
                  </div>
                ))
              )}
              {isStreaming && (
                <div className="flex justify-start" key="typing-indicator">
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-block size-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block size-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="inline-block size-2 animate-bounce rounded-full bg-muted-foreground"
                        style={{ animationDelay: "240ms" }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </StickToBottom.Content>
          </StickToBottom>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-background p-3 shadow-xs">
          <textarea
            className="min-h-[120px] w-full resize-none border-0 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="Describe the next scene..."
            rows={3}
            value={text}
          />
          <div className="flex shrink-0 flex-col gap-2">
            <Button
              className="shrink-0"
              disabled={!trimmedText || isStreaming}
              onClick={handleSend}
              size="icon"
              type="button"
            >
              <Send className="size-4" />
            </Button>
            <Button className="shrink-0" size="icon" type="button">
              <Paperclip className="size-4" />
            </Button>
            <Button className="shrink-0" size="icon" type="button">
              <Settings className="size-4" />
            </Button>
          </div>
        </div>
      </div>
    </aside>
  );
}
