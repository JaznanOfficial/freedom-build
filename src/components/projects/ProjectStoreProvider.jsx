"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";

const INITIAL_PROJECTS = [
  {
    id: "demo-project",
    name: "Demo Marketing Launch",
  },
];

const HEX_RADIX = 16;
const RANDOM_SLICE_START = 2;

function generateProjectId() {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }

  return `${Date.now()}-${Math.random().toString(HEX_RADIX).slice(RANDOM_SLICE_START)}`;
}

const ProjectStoreContext = createContext(null);

export function ProjectStoreProvider({ children }) {
  const [projects, setProjects] = useState(INITIAL_PROJECTS);
  const isLoading = false;

  const createProject = useCallback((name) => {
    const trimmed = typeof name === "string" ? name.trim() : "";
    if (!trimmed) {
      throw new Error("Project name is required");
    }

    const project = {
      id: generateProjectId(),
      name: trimmed,
    };

    setProjects((previous) => [project, ...previous]);
    return project;
  }, []);

  const updateProject = useCallback((id, name) => {
    const trimmed = typeof name === "string" ? name.trim() : "";
    if (!trimmed) {
      throw new Error("Project name is required");
    }

    let updatedProject = null;
    setProjects((previous) =>
      previous.map((project) => {
        if (project.id !== id) {
          return project;
        }
        updatedProject = { ...project, name: trimmed };
        return updatedProject;
      }),
    );

    if (!updatedProject) {
      throw new Error("Project not found");
    }

    return updatedProject;
  }, []);

  const deleteProject = useCallback((id) => {
    let found = false;
    setProjects((previous) => {
      const next = previous.filter((project) => {
        const shouldKeep = project.id !== id;
        if (!shouldKeep) {
          found = true;
        }
        return shouldKeep;
      });
      return next;
    });

    if (!found) {
      throw new Error("Project not found");
    }

    return true;
  }, []);

  const getProjectById = useCallback(
    (id) => projects.find((project) => project.id === id) ?? null,
    [projects],
  );

  const value = useMemo(
    () => ({
      projects,
      isLoading,
      createProject,
      updateProject,
      deleteProject,
      getProjectById,
    }),
    [projects, createProject, updateProject, deleteProject, getProjectById],
  );

  return <ProjectStoreContext.Provider value={value}>{children}</ProjectStoreContext.Provider>;
}

export function useProjectStore() {
  const context = useContext(ProjectStoreContext);
  if (!context) {
    throw new Error("useProjectStore must be used within a ProjectStoreProvider");
  }
  return context;
}
