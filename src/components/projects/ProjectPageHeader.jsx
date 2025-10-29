"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProject } from "@/hooks/queries/projects";

export function ProjectPageHeader({ projectId }) {
  const { data, isLoading } = useProject(projectId);

  if (isLoading) {
    return (
      <div className="space-y-2 text-center">
        <div className="mx-auto h-7 w-56 rounded-md">
          <Skeleton className="h-full w-full" />
        </div>
        <div className="mx-auto h-4 w-40 rounded-md">
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const name = data?.name || "Project";
  return (
    <div className="space-y-1 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{name}</h1>
      <p className="text-sm text-muted-foreground">ID: {projectId}</p>
    </div>
  );
}
