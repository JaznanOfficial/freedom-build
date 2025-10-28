"use client";

import { Coins, Command, LifeBuoy, Plus, Send } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import { NavProjectsSkeleton } from "@/components/loader-skeletons/nav-projects-skeleton";
import { NavProjects } from "@/components/nav-projects";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import {
  useCreateProject,
  useDeleteProject,
  useProjects,
  useUpdateProject,
} from "@/hooks/queries/projects";

const secondaryNavItems = [
  {
    title: "Credits",
    url: "/credits",
    icon: Coins,
  },
  {
    title: "Support",
    url: "/support",
    icon: LifeBuoy,
  },
  {
    title: "Feedback",
    url: "/feedback",
    icon: Send,
  },
];

export function AppSidebar({ ...props }) {
  const router = useRouter();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [projectName, setProjectName] = useState("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [projectPendingDeletion, setProjectPendingDeletion] = useState(null);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [projectPendingEdit, setProjectPendingEdit] = useState(null);
  const [editName, setEditName] = useState("");

  const {
    data,
    isLoading: projectsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProjects();

  const projects = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const { mutateAsync: createProject, isPending: isCreating } =
    useCreateProject();
  const { mutateAsync: deleteProject, isPending: isDeleting } =
    useDeleteProject();
  const { mutateAsync: updateProject, isPending: isUpdating } =
    useUpdateProject();

  const handleDialogChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setProjectName("");
    }
  };

  const handleRequestEdit = (project) => {
    setProjectPendingEdit(project);
    setEditName(project?.name ?? "");
    setEditDialogOpen(true);
  };

  const handleEditSubmit = async (event) => {
    event.preventDefault();
    const trimmed = editName.trim();
    if (!projectPendingEdit?.id || !trimmed) {
      toast.error("Project name is required");
      return;
    }
    try {
      await updateProject({ id: projectPendingEdit.id, name: trimmed });
      handleEditDialogChange(false);
    } catch (_error) {
      // toast handled in hook
    }
  };

  const handleDeleteDialogChange = (open) => {
    setDeleteDialogOpen(open);
    if (!open) {
      setProjectPendingDeletion(null);
    }
  };

  const handleEditDialogChange = (open) => {
    setEditDialogOpen(open);
    if (!open) {
      setProjectPendingEdit(null);
      setEditName("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const trimmedName = projectName.trim();

    if (!trimmedName) {
      toast.error("Project name is required");
      return;
    }

    try {
      const created = await createProject({ name: trimmedName });
      setProjectName("");
      handleDialogChange(false);
      if (created?.id) {
        router.push(`/projects/${created.id}`);
      }
    } catch (_error) {
      // Error toast handled in mutation hook
    }
  };

  const handleRequestDelete = (project) => {
    setProjectPendingDeletion(project);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!projectPendingDeletion?.id) {
      return;
    }

    try {
      await deleteProject(projectPendingDeletion.id);
      handleDeleteDialogChange(false);
    } catch (_error) {
      // Error toast handled in mutation hook
    }
  };

  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild size="lg">
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <Command className="size-4" />
                </div>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span className="truncate font-medium">Acme Inc</span>
                  <span className="truncate text-xs">Enterprise</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <div className="px-4 pb-2">
          <Dialog onOpenChange={handleDialogChange} open={dialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <Plus className="size-4" />
                <span>Create Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <form className="space-y-4" onSubmit={handleSubmit}>
                <DialogHeader>
                  <DialogTitle>Create a new project</DialogTitle>
                  <DialogDescription>
                    Name your project to get started with a fresh workspace.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-2">
                  <label className="font-medium text-sm" htmlFor="project-name">
                    Project name
                  </label>
                  <Input
                    autoFocus
                    disabled={isCreating}
                    id="project-name"
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Enter project name"
                    value={projectName}
                  />
                </div>
                <DialogFooter>
                  <Button
                    className="w-full"
                    disabled={isCreating}
                    type="submit"
                  >
                    {isCreating ? "Creating..." : "Create & Go to the project"}
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        {projectsLoading ? (
          <NavProjectsSkeleton />
        ) : (
          <NavProjects
            hasMore={Boolean(hasNextPage)}
            isLoadingMore={isFetchingNextPage}
            onLoadMore={() => fetchNextPage()}
            onRequestEdit={handleRequestEdit}
            onRequestDelete={handleRequestDelete}
            projects={projects}
          />
        )}
        <NavSecondary className="mt-auto" items={secondaryNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
      <Dialog open={deleteDialogOpen} onOpenChange={handleDeleteDialogChange}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete project</DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently remove
              {" "}
              <strong>{projectPendingDeletion?.name ?? "this project"}</strong>
              .
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <DialogClose asChild>
              <Button variant="outline" disabled={isDeleting} type="button">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={handleDeleteConfirm}
              type="button"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={editDialogOpen} onOpenChange={handleEditDialogChange}>
        <DialogContent>
          <form className="space-y-4" onSubmit={handleEditSubmit}>
            <DialogHeader>
              <DialogTitle>Edit project</DialogTitle>
              <DialogDescription>Update the project name.</DialogDescription>
            </DialogHeader>
            <div className="space-y-2">
              <label className="font-medium text-sm" htmlFor="edit-project-name">
                Project name
              </label>
              <Input
                id="edit-project-name"
                value={editName}
                disabled={isUpdating}
                onChange={(e) => setEditName(e.target.value)}
                placeholder="Enter project name"
                autoFocus
              />
            </div>
            <DialogFooter>
              <DialogClose asChild>
                <Button variant="outline" disabled={isUpdating} type="button">
                  Cancel
                </Button>
              </DialogClose>
              <Button disabled={isUpdating} type="submit">
                {isUpdating ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </Sidebar>
  );
}
