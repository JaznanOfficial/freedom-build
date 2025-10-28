"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md px-1 py-1.5">
      <Skeleton className="size-8 rounded-full" />
      <Skeleton className="h-3.5 flex-1 rounded-full" />
      <Skeleton className="size-5 rounded-full" />
    </div>
  );
}
