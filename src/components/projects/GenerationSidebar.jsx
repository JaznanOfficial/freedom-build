"use client";

import { Mic, Paperclip, Send, Settings } from "lucide-react";
import { useState } from "react";
import { StickToBottom } from "use-stick-to-bottom";
import { useProjectChat } from "@/components/projects/ChatProvider";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { GenerationMessageList } from "./GenerationMessageList";

const STREAMING_STATUS = "streaming";

export function GenerationSidebar({ className }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useProjectChat();

  const isStreaming = status === STREAMING_STATUS;
  const statusLabel = isStreaming ? "Jaznan is generating..." : "Jaznan is ready.";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) {
      return;
    }
    sendMessage(trimmed);
    setInput("");
  };

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
                    Start ideating scenes here. This area will display the
                    latest chat updates.
                  </div>
                </div>
              ) : (
                <GenerationMessageList messages={messages} />
              )}
              {isStreaming && (
                <div className="flex justify-start" key="thinking-indicator">
                  <div className="flex items-center gap-2 rounded-full bg-primary/10 px-4 py-2 text-primary text-sm shadow-sm">
                    <Mic className="size-4 animate-pulse" />
                    <span className="font-medium">{statusLabel}</span>
                  </div>
                </div>
              )}
            </StickToBottom.Content>
          </StickToBottom>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-background p-3 shadow-xs">
          <textarea
            className="min-h-[120px] w-full resize-none border-0 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Describe the next scene..."
            rows={3}
            value={input}
          />
          <div className="flex shrink-0 flex-col gap-2">
            <Button
              className="shrink-0"
              disabled={!input.trim() || isStreaming}
              onClick={handleSubmit}
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
