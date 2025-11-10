"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { useProjectStore } from "@/components/projects/ProjectStoreProvider";

export function ProjectPageHeader({ projectId }) {
  const { getProjectById } = useProjectStore();
  const project = getProjectById(projectId);

  if (!project) {
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

  return (
    <div className="space-y-0.5 text-center">
      <h1 className="text-lg font-semibold tracking-tight md:text-2xl">
        {project.name}
      </h1>
      <p className="text-xs text-muted-foreground md:text-sm">ID: {projectId}</p>
    </div>
  );
}
