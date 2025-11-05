"use client";

import { useState } from "react";
import { Paperclip, Send, Settings } from "lucide-react";

import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { cn } from "@/lib/utils";

export function GenerationSidebar({ className }) {
  const { messages, sendMessage, status } = useProjectChat();
  const [text, setText] = useState("");

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

  return (
    <aside className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-medium text-foreground text-sm">
              Conversation
            </span>
            {isStreaming && <Spinner className="size-4 text-muted-foreground" />}
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-3 text-sm">
            {messages.length === 0 ? (
              <div className="flex justify-start">
                <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                  Start ideating scenes here. This area will display the latest
                  chat updates.
                </div>
              </div>
            ) : (
              messages.map((message) => {
                const isUser = message.role === "user";
                const textContent = getMessageText(message);
                if (!textContent) {
                  return null;
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
                      {isUser ? textContent : <Response>{textContent}</Response>}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-background p-3 shadow-xs">
          <textarea
            className="min-h-[120px] w-full resize-none border-0 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            onChange={(event) => setText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && (event.metaKey || event.ctrlKey)) {
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
