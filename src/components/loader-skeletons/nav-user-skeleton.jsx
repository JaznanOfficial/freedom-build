"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function NavUserSkeleton() {
  return (
    <div className="flex items-center gap-3 rounded-md px-1 py-1.5">
      <Skeleton className="size-8 rounded-full" />
      <div className="flex flex-1 flex-col gap-1">
        <Skeleton className="h-3.5 w-32" />
        <Skeleton className="h-2.5 w-40" />
      </div>
      <Skeleton className="h-4 w-4 rounded-full" />
    </div>
  );
}
