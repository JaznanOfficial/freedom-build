"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function FloatingChatLauncher() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");

  function handleSend(e) {
    e.preventDefault();
    const value = text.trim();
    if (!value) return;
    setMessages((prev) => [...prev, { role: "user", content: value }]);
    setText("");
  }

  return (
    <>
      {open && (
        <div className="fixed right-4 bottom-20 z-50 w-[min(90vw,28rem)] h-[60vh] max-h-[75vh] md:right-8 md:bottom-24 rounded-lg border bg-card shadow-xl flex flex-col overflow-hidden">
          <div className="flex h-12 items-center px-4 border-b">
            <div className="text-lg font-semibold">Jaznan</div>
          </div>
          <div className="mx-4 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-muted/30">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-3">
                {messages.length === 0 ? (
                  <ConversationEmptyState
                    description="Start a conversation."
                    title="No messages yet"
                  />
                ) : (
                  messages.map((m, i) => (
                    <div
                      className={
                        m.role === "user"
                          ? "ml-auto max-w-[80%] rounded-xl bg-primary px-3 py-2 text-secondary"
                          : "mr-auto max-w-[80%] rounded-xl bg-muted px-3 py-2"
                      }
                      key={`${m.role}-${i}`}
                    >
                      {m.content}
                    </div>
                  ))
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
