"use client";

import { GenerationSceneCard } from "./GenerationSceneCard";

export function GenerationSceneGrid({ scenes }) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    return null;
  }

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {scenes.map((scene) => (
        <GenerationSceneCard key={scene.id} scene={scene} />
      ))}
    </div>
  );
}
