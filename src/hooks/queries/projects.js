"use client";

import {
  useInfiniteQuery,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";

const PROJECTS_QUERY_KEY = ["projects"];
const PROJECTS_PAGE_SIZE = 10;

async function handleResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error || "Something went wrong";
    throw new Error(message);
  }
  return body;
}

async function fetchProjects({ pageParam = 1 }) {
  const response = await fetch(
    `/api/projects?page=${pageParam}&limit=${PROJECTS_PAGE_SIZE}`,
    {
      method: "GET",
      cache: "no-store",
    },
  );
  return handleResponse(response);
}

export function useProjects() {
  return useInfiniteQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: ({ pageParam }) => fetchProjects({ pageParam }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => lastPage?.meta?.nextPage ?? undefined,
  });
}

async function createProject(payload) {
  const response = await fetch("/api/projects", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const body = await handleResponse(response);
  return body?.data;
}

export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createProject,
    onSuccess(data) {
      toast.success("Project created successfully");
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
      return data;
    },
    onError(error) {
      toast.error(error.message || "Failed to create project");
    },
  });
}

async function deleteProject(id) {
  const response = await fetch(`/api/projects/${id}`, {
    method: "DELETE",
  });

  await handleResponse(response);
  return true;
}

export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteProject,
    onSuccess() {
      toast.success("Project deleted successfully");
      queryClient.invalidateQueries({ queryKey: PROJECTS_QUERY_KEY });
    },
    onError(error) {
      toast.error(error.message || "Failed to delete project");
    },
  });
}
