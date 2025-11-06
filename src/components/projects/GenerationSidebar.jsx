"use client";

import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { Paperclip, Send, Settings } from "lucide-react";
import { StickToBottom } from "use-stick-to-bottom";
import { Response } from "@/components/ai-elements/response";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

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

export function GenerationSidebar({ className }) {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  const isStreaming = status === "streaming";

  const handleSubmit = () => {
    const trimmed = input.trim();
    if (!trimmed || isStreaming) {
      return;
    }
    sendMessage({ parts: [{ type: "text", text: trimmed }] });
    setInput("");
  };

  return (
    <aside className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-medium text-foreground text-sm">Conversation</span>
          </div>
          <StickToBottom className="flex-1 overflow-y-auto" initial="smooth" resize="smooth">
            <StickToBottom.Content className="space-y-3 p-3 text-sm">
              {messages.length === 0 ? (
                <div className="flex justify-start">
                  <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                    Start ideating scenes here. This area will display the latest chat updates.
                  </div>
                </div>
              ) : (
                messages.map((message) => {
                  const content = extractTextContent(message);
                  if (!content) {
                    return null;
                  }
                  const isUser = message.role === "user";
                  return (
                    <div
                      className={`flex ${isUser ? "justify-end" : "justify-start"}`}
                      key={message.id}
                    >
                      <div
                        className={`max-w-[85%] whitespace-pre-wrap rounded-lg px-3 py-2 text-sm ${
                          isUser ? "bg-primary/10 text-primary" : "bg-muted text-foreground"
                        }`}
                      >
                        {isUser ? content : <Response>{content}</Response>}
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
