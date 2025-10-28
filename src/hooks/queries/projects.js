"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const PROJECTS_QUERY_KEY = ["projects"];

async function handleResponse(response) {
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    const message = body?.error || "Something went wrong";
    throw new Error(message);
  }
  return body?.data;
}

async function fetchProjects() {
  const response = await fetch("/api/projects", {
    method: "GET",
    cache: "no-store",
  });
  return handleResponse(response);
}

export function useProjects() {
  return useQuery({
    queryKey: PROJECTS_QUERY_KEY,
    queryFn: fetchProjects,
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

  return handleResponse(response);
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
