"use client";

import { useMemo } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Response } from "@/components/ai-elements/response";
import { Spinner } from "@/components/ui/spinner";
import { GenerationSceneGrid } from "@/components/projects/GenerationSceneGrid";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";

export function GenerationView() {
  const { messages, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const latestAssistant = useMemo(() => {
    for (let i = messages.length - 1; i >= 0; i -= 1) {
      if (messages[i]?.role === "assistant") {
        return messages[i];
      }
    }
    return null;
  }, [messages]);

  const latestAssistantText = useMemo(() => {
    if (!latestAssistant) return null;
    if (Array.isArray(latestAssistant.parts)) {
      return latestAssistant.parts
        .filter((part) => part.type === "text")
        .map((part) => part.text)
        .join("");
    }
    return typeof latestAssistant.content === "string"
      ? latestAssistant.content
      : null;
  }, [latestAssistant]);

  const isStreaming = status === "streaming";
  const placeholderScenes = useMemo(
    () => [
      {
        id: "scene-1",
        label: "Scene 1",
        duration: "5 seconds",
        description:
          "Hero shot introducing the product with bold headline overlay.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "scene-2",
        label: "Scene 2",
        duration: "8 seconds",
        description:
          "Feature walkthrough highlighting key capabilities with motion graphics.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
      },
      {
        id: "scene-3",
        label: "Scene 3",
        duration: "10 seconds",
        description:
          "Customer testimonial scene with call-to-action transition.",
        videoUrl:
          "https://storage.googleapis.com/coverr-main/mp4/Night-Drive.mp4",
      },
    ],
    []
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 md:grid md:grid-cols-4">
      <GenerationSidebar />
      <div className="flex h-full flex-col rounded-xl bg-muted/50 p-4 md:col-span-3">
        <div className="flex h-full flex-col gap-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-medium text-sm">Generated scenes</div>
              {isStreaming && <Spinner className="size-4" />}
            </div>
            <div className="flex-1 overflow-auto p-4">
              {latestAssistantText ? (
                <Response>{latestAssistantText}</Response>
              ) : (
                <GenerationSceneGrid scenes={placeholderScenes} />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
