"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useState } from "react";
import { Response } from "@/components/ai-elements/response";

export default function ChatPage() {
  const [input, setInput] = useState("");
  const { messages, sendMessage, status } = useChat({
    transport: new DefaultChatTransport({ api: "/api/chat" }),
  });

  return (
    <div className="mx-auto flex w-full max-w-md flex-col py-24">
      <div className="flex flex-col gap-4">
        {messages.map((message) => (
          <div className="whitespace-pre-wrap text-sm" key={message.id}>
            <div className="mb-1 font-medium text-muted-foreground">
              {message.role === "user" ? "You:" : "Jaznan:"}
            </div>
            <div className="rounded-xl bg-muted p-3">
              {Array.isArray(message.parts)
                ? message.parts
                    .filter((p) => p.type === "text")
                    .map((p, i) => (
                      <Response key={`${message.id}-${i}`}>{p.text}</Response>
                    ))
                : typeof message.content === "string"
                  ? message.content
                  : null}
            </div>
          </div>
        ))}
      </div>

      <form
        className="-translate-x-1/2 fixed bottom-0 left-1/2 w-full max-w-md p-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!input.trim()) return;
          sendMessage({ parts: [{ type: "text", text: input }] });
          setInput("");
        }}
      >
        <input
          className="w-full rounded border border-border bg-background p-2 shadow-sm outline-none"
          onChange={(e) => setInput(e.currentTarget.value)}
          placeholder={
            status === "streaming" ? "Generating…" : "Say something..."
          }
          value={input}
        />
      </form>
    </div>
  );
}
