"use client";

import { cn } from "@/lib/utils";

export function GenerationSidebar({ className }) {
  return (
    <div
      className={cn(
        "hidden min-h-0 rounded-xl bg-muted/50 p-4 md:col-span-1 md:block md:sticky md:top-32 md:h-[calc(100vh-12rem)] md:max-h-[calc(100vh-12rem)] md:self-start",
        className,
      )}
    />
  );
}
