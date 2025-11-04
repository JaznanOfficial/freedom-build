"use client";

import { useMemo, useState } from "react";
import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { MessageCircle } from "lucide-react";
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
import { Input } from "@/components/ui/input";
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

  return (
    <div className="grid h-full min-h-0 flex-1 grid-cols-1 gap-4 md:grid-cols-4">
      <div className="flex h-full flex-col rounded-xl bg-muted/50 p-4 md:col-span-1">
        <div className="flex h-full flex-col gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-sm">Prompt to Jaznan</div>
            <div className="text-muted-foreground text-xs">
              Describe what you want to generate. Jaznan will craft the right workflow.
            </div>
          </div>
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
          <form className="flex gap-2" onSubmit={handleSubmit}>
            <Input
              onChange={(event) => setText(event.target.value)}
              placeholder="Describe your generation"
              value={text}
            />
            <Button disabled={!text.trim()} type="submit">
              Send
            </Button>
          </form>
        </div>
      </div>
      <div className="flex h-full flex-col rounded-xl bg-muted/50 p-4 md:col-span-3">
        <div className="flex h-full flex-col gap-4">
          <div className="space-y-1">
            <div className="font-semibold text-sm">Generation</div>
            <div className="text-muted-foreground text-xs">
              Jaznan streams the latest plan and output for your request.
            </div>
          </div>
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-medium text-sm">Latest response</div>
              {isStreaming && <Spinner className="size-4" />}
            </div>
            <div className="flex-1 overflow-auto p-4">
              {latestAssistantText ? (
                <Response>{latestAssistantText}</Response>
              ) : (
                <Empty className="border-none p-0">
                  <EmptyHeader>
                    <EmptyMedia variant="icon">
                      <MessageCircle className="size-6" />
                    </EmptyMedia>
                    <EmptyTitle>No generation yet</EmptyTitle>
                    <EmptyDescription>
                      Send a prompt to see Jaznan build your workflow.
                    </EmptyDescription>
                  </EmptyHeader>
                </Empty>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
