"use client";

import { useRef, useState } from "react";
import { Paperclip, Send, Settings } from "lucide-react";

import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { cn } from "@/lib/utils";
import { StickToBottom } from "use-stick-to-bottom";

function parseScenesFromText(raw) {
  if (!raw) {
    return null;
  }

  let text = raw.trim();
  if (!text) {
    return null;
  }

  const codeMatch = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  if (codeMatch) {
    text = codeMatch[1].trim();
  }

  try {
    const parsed = JSON.parse(text);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    if (parsed && Array.isArray(parsed.scenes)) {
      return parsed.scenes;
    }
  } catch (error) {
    return null;
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
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>Scene {scene.scene_serial}</span>
            <span>{scene.duration}s</span>
          </div>
          <div className="mt-1 text-sm font-medium text-foreground">
            {scene.prompt}
          </div>
          <div className="mt-1 flex flex-wrap gap-2 text-xs text-muted-foreground">
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
  const { messages, sendMessage, status } = useProjectChat();
  const [text, setText] = useState("");
  const persistedSceneMessages = useRef(new Set());

  const isStreaming = status === "streaming";
  const trimmedText = text.trim();

  function getMessageText(message) {
    if (Array.isArray(message.parts)) {
      return message.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
    }
    if (typeof message.content === "string") {
      return message.content;
    }
    return "";
  }

  function handleSend() {
    if (!trimmedText || isStreaming) {
      return;
    }
    sendMessage({ parts: [{ type: "text", text: trimmedText }] });
    setText("");
  }

  function persistScenes(messageId, scenes, projectId) {
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
            project_id: projectId ?? scene.project_id ?? "default-project",
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
  }

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
              {messages.length === 0 ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                    Start ideating scenes here. This area will display the latest chat updates.
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const isUser = message.role === "user";
                  const textContent = getMessageText(message);
                  if (!textContent) {
                    return null;
                  }

                  const scenes = !isUser ? parseScenesFromText(textContent) : null;
                  if (scenes && scenes.length > 0) {
                    persistScenes(message.id, scenes, message.project_id);
                  }

                  return (
                    <div
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      key={message.id}
                    >
                      <div
                        className={
                          isUser
                            ? "max-w-[85%] whitespace-pre-wrap rounded-lg bg-primary/10 px-3 py-2 text-primary"
                            : "max-w-[85%] whitespace-pre-wrap rounded-lg bg-muted px-3 py-2"
                        }
                      >
                        {isUser ? (
                          textContent
                        ) : scenes && scenes.length > 0 ? (
                          <SceneList scenes={scenes} />
                        ) : (
                          <Response>{textContent}</Response>
                        )}
                      </div>
                    </div>
                  );
                })
              )}
              {isStreaming && (
                <div className="flex justify-start" key="typing-indicator">
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2">
                    <div className="flex items-center gap-1">
                      <span
                        className="inline-block size-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "0ms" }}
                      />
                      <span
                        className="inline-block size-2 rounded-full bg-muted-foreground animate-bounce"
                        style={{ animationDelay: "120ms" }}
                      />
                      <span
                        className="inline-block size-2 rounded-full bg-muted-foreground animate-bounce"
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
