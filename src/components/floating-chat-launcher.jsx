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
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
      <Dialog onOpenChange={setOpen} open={open}>
        <DialogContent className="flex h-[70vh] max-w-xl flex-col gap-0 p-0">
          <DialogHeader className="px-4 pt-4">
            <DialogTitle>AI Assistant</DialogTitle>
          </DialogHeader>
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
        </DialogContent>
      </Dialog>

      <Button
        className="fixed right-4 bottom-4 z-50 rounded-full bg-primary p-0 text-secondary shadow-lg hover:bg-primary md:right-6 md:bottom-6"
        onClick={() => setOpen(true)}
        size="icon-lg"
        type="button"
        variant="default"
      >
        <MessageCircle className="size-6" />
      </Button>
    </>
  );
}
