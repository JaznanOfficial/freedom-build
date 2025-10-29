"use client";

import { MessageCircle } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Conversation,
  ConversationContent,
  ConversationEmptyState,
  ConversationScrollButton,
} from "@/components/ai-elements/conversation";

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
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="flex h-[70vh] max-w-xl flex-col gap-0 p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
          <div className="mx-4 mb-3 flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-muted/30">
            <Conversation className="flex-1">
              <ConversationContent className="space-y-3">
                {messages.length === 0 ? (
                  <ConversationEmptyState title="No messages yet" description="Start a conversation." />
                ) : (
                  messages.map((m, i) => (
                    <div
                      key={`${m.role}-${i}`}
                      className={
                        m.role === "user"
                          ? "ml-auto max-w-[80%] rounded-xl bg-primary px-3 py-2 text-secondary"
                          : "mr-auto max-w-[80%] rounded-xl bg-muted px-3 py-2"
                      }
                    >
                      {m.content}
                    </div>
                  ))
                )}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
          </div>
          <form onSubmit={handleSend} className="flex gap-2 px-4 pb-4">
            <Input
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Type a message"
            />
            <Button type="submit">Send</Button>
          </form>
        </DialogContent>
      </Dialog>

      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="fixed bottom-4 right-4 z-50 rounded-full bg-primary p-0 text-secondary shadow-lg hover:bg-primary md:bottom-6 md:right-6"
        size="icon-lg"
        variant="default"
      >
        <MessageCircle className="size-6" />
      </Button>
    </>
  );
}
