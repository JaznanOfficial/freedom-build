"use client";

import { Paperclip, Send, Settings } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GenerationSidebar({ className }) {
  return (
    <aside className={cn("flex h-full min-h-0 flex-col", className)}>
      <div className="flex h-full min-h-0 flex-col gap-4">
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
          <div className="flex items-center justify-between border-b px-4 py-3">
            <span className="font-medium text-foreground text-sm">
              Conversation
            </span>
          </div>
          <div className="flex-1 space-y-3 overflow-auto p-3 text-sm">
            <div className="flex justify-start">
              <div className="max-w-[85%] rounded-lg bg-muted px-3 py-2 text-muted-foreground">
                Start ideating scenes here. This area will display the latest
                chat updates.
              </div>
            </div>
            <div className="flex justify-end">
              <div className="max-w-[85%] rounded-lg bg-primary/10 px-3 py-2 text-primary">
                Scene draft looks solid. Want to adjust the intro pacing?
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2 rounded-lg border bg-background p-3 shadow-xs">
          <textarea
            className="min-h-[120px] w-full resize-none border-0 bg-transparent text-foreground text-sm outline-none placeholder:text-muted-foreground focus-visible:outline-none"
            placeholder="Describe the next scene..."
            rows={3}
          />
          <div className="flex shrink-0 flex-col gap-2">
            <Button className="shrink-0" size="icon" type="button">
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
