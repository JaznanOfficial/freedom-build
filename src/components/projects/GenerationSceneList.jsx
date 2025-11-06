"use client";

export function GenerationSceneList({ scenes }) {
  if (!Array.isArray(scenes) || scenes.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2">
      {scenes.map((scene) => (
        <div
          className="rounded-lg border border-muted bg-background px-3 py-2"
          key={`${scene.scene_serial}-${scene.prompt}`}
        >
          <div className="flex items-center justify-between text-muted-foreground text-xs">
            <span>Scene {scene.scene_serial}</span>
            {scene.duration ? <span>{scene.duration}s</span> : null}
          </div>
          <div className="mt-1 font-medium text-foreground text-sm">{scene.prompt}</div>
          <div className="mt-1 flex flex-wrap gap-2 text-muted-foreground text-xs">
            {scene.aspect_ratio ? (
              <span className="rounded bg-muted px-1.5 py-0.5">{scene.aspect_ratio}</span>
            ) : null}
            {scene.resolution ? (
              <span className="rounded bg-muted px-1.5 py-0.5">{scene.resolution}</span>
            ) : null}
            {scene.status ? (
              <span className="rounded bg-muted px-1.5 py-0.5 capitalize">{scene.status}</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
