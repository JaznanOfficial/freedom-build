"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle, Send } from "lucide-react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Response } from "@/components/ai-elements/response";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { Spinner } from "@/components/ui/spinner";

export function GenerationView() {
  const [text, setText] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  function handleSubmit(event) {
    event.preventDefault();
    const value = text.trim();
    if (!value) return;
    sendMessage({ parts: [{ type: "text", text: value }] });
    setText("");
  }

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
        description: "Hero shot introducing the product with bold headline overlay.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "scene-2",
        label: "Scene 2",
        duration: "8 seconds",
        description: "Feature walkthrough highlighting key capabilities with motion graphics.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
      },
      {
        id: "scene-3",
        label: "Scene 3",
        duration: "10 seconds",
        description: "Customer testimonial scene with call-to-action transition.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Night-Drive.mp4",
      },
    ],
    []
  );

  return (
    <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-4">
      <div className="flex h-full flex-col rounded-xl bg-muted/50 p-4 md:col-span-1">
        <div className="flex h-full flex-col gap-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-3">
                {messages.length === 0 ? (
                  <Empty className="border-none p-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageCircle className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>Start a message</EmptyTitle>
                      <EmptyDescription>
                        Share your product idea, requirements, or changes.
                      </EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  messages.map((message) => {
                    const isUser = message.role === "user";
                    return (
                      <div
                        className={`flex items-end gap-2 ${
                          isUser ? "justify-end" : "justify-start"
                        }`}
                        key={message.id}
                      >
                        {!isUser && (
                          <Avatar className="size-7">
                            <AvatarImage
                              alt="Jaznan avatar"
                              src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Jaznan"
                            />
                            <AvatarFallback>JZ</AvatarFallback>
                          </Avatar>
                        )}
                        <div
                          className={
                            isUser
                              ? "max-w-[80%] whitespace-pre-wrap rounded-xl bg-primary px-3 py-2 text-secondary"
                              : "max-w-[80%] whitespace-pre-wrap rounded-xl bg-muted px-3 py-2"
                          }
                        >
                          {Array.isArray(message.parts) ? (
                            <Response key={message.id}>
                              {message.parts
                                .filter((part) => part.type === "text")
                                .map((part) => part.text)
                                .join("")}
                            </Response>
                          ) : typeof message.content === "string" ? (
                            message.content
                          ) : null}
                        </div>
                      </div>
                    );
                  })
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
          <form className="relative flex" onSubmit={handleSubmit}>
            <textarea
              className="min-h-[6rem] w-full resize-none rounded-md border border-input bg-background px-3 py-2 pr-12 text-sm text-foreground shadow-xs transition-[color,box-shadow] outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
              onChange={(event) => setText(event.target.value)}
              placeholder="Describe your generation"
              value={text}
            />
            <Button
              aria-label="Send"
              className="absolute bottom-2 right-2 h-9 w-9 rounded-full p-0"
              disabled={!text.trim()}
              size="icon"
              type="submit"
              variant="default"
            >
              <Send className="size-4" />
            </Button>
          </form>
        </div>
      </div>
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
                <div className="grid gap-3 md:grid-cols-2">
                  {placeholderScenes.map((scene) => (
                    <div
                      className="flex flex-col gap-3 rounded-lg border border-dashed border-muted-foreground/40 bg-muted/30 p-3"
                      key={scene.id}
                    >
                      <div className="relative overflow-hidden rounded-md border bg-background">
                        <video
                          className="h-full w-full object-cover"
                          controls
                          loop
                          muted
                          poster="https://placehold.co/640x360/EEE/AAA?text=Scene+preview"
                        >
                          <source src={scene.videoUrl} type="video/mp4" />
                        </video>
                      </div>
                      <div className="flex items-center justify-between text-sm font-medium">
                        <span>{scene.label}</span>
                        <span className="text-muted-foreground text-xs">
                          {scene.duration}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-xs leading-relaxed">
                        {scene.description}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
