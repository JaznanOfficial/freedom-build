"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { useChat } from "@ai-sdk/react";
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Empty, EmptyHeader, EmptyTitle, EmptyDescription, EmptyMedia } from "@/components/ui/empty";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FloatingChatLauncher() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const { messages, sendMessage, status } = useChat({ api: "/api/chat" });

  function handleSend(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    sendMessage({ text: value });
    setText("");
  }

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-20 z-50 flex h-[60vh] max-h-[75vh] w-[min(90vw,28rem)] flex-col overflow-hidden rounded-lg border bg-card shadow-xl md:right-8 md:bottom-24">
          <div className="flex h-12 items-center gap-3 px-4">
            <div className="relative">
              <Avatar className="size-8">
                <AvatarImage
                  alt="Jaznan avatar"
                  src="https://api.dicebear.com/7.x/bottts-neutral/svg?seed=Jaznan"
                />
                <AvatarFallback>JZ</AvatarFallback>
              </Avatar>
              <span
                aria-label="Online"
                className="-bottom-0 -right-0 absolute block size-2.5 rounded-full bg-green-500 ring-2 ring-card"
              />
            </div>
            <div className="font-semibold text-lg">Jaznan</div>
          </div>
          <div className="mx-4 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-muted/30">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-3">
                {messages.length === 0 ? (
                  <Empty className="border-none p-0">
                    <EmptyHeader>
                      <EmptyMedia variant="icon">
                        <MessageCircle className="size-6" />
                      </EmptyMedia>
                      <EmptyTitle>No messages yet</EmptyTitle>
                      <EmptyDescription>Start a conversation.</EmptyDescription>
                    </EmptyHeader>
                  </Empty>
                ) : (
                  messages.map((m) => {
                    const isUser = m.role === "user";
                    const textParts = Array.isArray(m.parts)
                      ? m.parts
                          .filter((p) => p.type === "text")
                          .map((p) => p.text)
                          .join("")
                      : typeof m.content === "string"
                        ? m.content
                        : "";
                    return (
                      <div
                        key={m.id}
                        className={`flex items-end gap-2 ${isUser ? "justify-end" : "justify-start"}`}
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
                              ? "max-w-[80%] rounded-xl bg-primary px-3 py-2 text-secondary"
                              : "max-w-[80%] rounded-xl bg-muted px-3 py-2"
                          }
                        >
                          {textParts}
                        </div>
                        {/* user avatar removed per request */}
                      </div>
                    );
                  })
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
          <form className="flex gap-2 px-4 pb-4" onSubmit={handleSend}>
            <Input
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
              value={text}
            />
            <Button type="submit">Send</Button>
          </form>
        </div>
      )}

      <Button
        className="fixed right-4 bottom-4 z-50 rounded-full bg-primary p-0 text-secondary shadow-lg hover:bg-primary md:right-8 md:bottom-8"
        onClick={() => setOpen((v) => !v)}
        size="icon-lg"
        type="button"
        variant="default"
      >
        <MessageCircle className="size-6" />
      </Button>
    </>
  );
}
