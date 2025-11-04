"use client";

import { Send } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function GenerationSidebar({ className }) {
  return (
    <aside className={cn("flex h-full min-h-0 flex-col gap-4", className)}>
      <div className="flex-1 rounded-lg border border-dashed bg-muted/40" />
      <div className="flex items-start gap-2 rounded-lg border bg-background p-3 shadow-xs">
        <textarea
          className="min-h-[120px] w-full resize-none border-0 bg-transparent text-sm text-foreground outline-none focus-visible:outline-none placeholder:text-muted-foreground"
          placeholder="Describe the next scene..."
          rows={3}
        />
        <Button className="shrink-0" size="icon" type="button">
          <Send className="size-4" />
        </Button>
      </div>
    </aside>
  );
}
