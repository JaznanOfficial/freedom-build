"use client";

import { PanelLeftOpen } from "lucide-react";
import { useMemo } from "react";
import { GenerationSceneGrid } from "@/components/projects/GenerationSceneGrid";
import { GenerationSidebar } from "@/components/projects/GenerationSidebar";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useProjectChat } from "@/components/projects/ChatProvider";

export function GenerationView() {
  useProjectChat();
  const placeholderScenes = useMemo(
    () => [
      {
        id: "scene-1",
        label: "Scene 1",
        duration: "5 seconds",
        description:
          "Hero shot introducing the product with bold headline overlay.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Mt_Baker.mp4",
      },
      {
        id: "scene-2",
        label: "Scene 2",
        duration: "8 seconds",
        description:
          "Feature walkthrough highlighting key capabilities with motion graphics.",
        videoUrl: "https://storage.googleapis.com/coverr-main/mp4/Footboys.mp4",
      },
      {
        id: "scene-3",
        label: "Scene 3",
        duration: "10 seconds",
        description:
          "Customer testimonial scene with call-to-action transition.",
        videoUrl:
          "https://storage.googleapis.com/coverr-main/mp4/Night-Drive.mp4",
      },
    ],
    []
  );

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col gap-4 lg:grid lg:grid-cols-4">
      <GenerationSidebar className="hidden lg:block" />
      <div className="flex h-full min-h-0 flex-col lg:col-span-3">
        <div className="mb-4 lg:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button
                className="rounded-full bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground dark:bg-input/50 dark:hover:bg-input/50"
                size="icon"
                variant="outline"
              >
                <PanelLeftOpen className="size-4" />
                <span className="sr-only">Open panel</span>
              </Button>
            </SheetTrigger>
            <SheetContent
              className="w-full max-w-sm gap-0 p-0"
              hideClose
              side="left"
            >
              <div className="h-full overflow-auto">
                <GenerationSidebar className="p-4" />
              </div>
            </SheetContent>
          </Sheet>
        </div>
        <div className="flex h-full min-h-0 flex-col gap-4">
          <div className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border bg-background">
            <div className="flex items-center justify-between border-b px-4 py-3">
              <div className="font-medium text-sm">Generated scenes</div>
            </div>
            <div className="flex-1 overflow-auto p-4">
              <GenerationSceneGrid scenes={placeholderScenes} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
