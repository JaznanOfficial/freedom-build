"use client";

import { cn } from "@/lib/utils";

export function GenerationSceneCard({ scene, className }) {
  if (!scene) return null;

  const { label, duration, description, videoUrl } = scene;

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-lg border border-muted-foreground/40 border-dashed bg-muted/30 p-3",
        className
      )}
    >
      <div className="relative overflow-hidden rounded-md border bg-background">
        <video
          className="h-full w-full object-cover"
          controls
          loop
          muted
          poster="https://placehold.co/640x360/EEE/AAA?text=Scene+preview"
        >
          <source src={videoUrl} type="video/mp4" />
        </video>
      </div>
      <div className="flex items-center justify-between font-medium text-sm">
        <span>{label}</span>
        <span className="text-muted-foreground text-xs">{duration}</span>
      </div>
      <p className="text-muted-foreground text-xs leading-relaxed">
        {description}
      </p>
    </div>
  );
}
