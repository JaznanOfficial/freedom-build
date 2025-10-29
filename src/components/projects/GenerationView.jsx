"use client";

export function GenerationView() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-5">
      <div className="rounded-xl bg-muted/50 p-4 md:col-span-2">
        <div className="text-muted-foreground text-sm">Left panel (2/5)</div>
      </div>
      <div className="rounded-xl bg-muted/50 p-4 md:col-span-3">
        <div className="text-muted-foreground text-sm">Right panel (3/5)</div>
      </div>
    </div>
  );
}
