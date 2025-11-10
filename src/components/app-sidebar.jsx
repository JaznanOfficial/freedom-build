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
import { useProjectStore } from "@/components/projects/ProjectStoreProvider";

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
    projects,
    createProject,
    deleteProject,
    updateProject,
  } = useProjectStore();
  const projectsLoading = false;
  const isFetchingNextPage = false;
  const hasNextPage = false;

  const [isCreating, setIsCreating] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

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

    if (!projectPendingEdit?.id) {
      toast.error("Project name is required");
      return;
    }

    const trimmed = editName.trim();
    if (!trimmed) {
      toast.error("Project name is required");
      return;
    }

    try {
      setIsUpdating(true);
      await updateProject(projectPendingEdit.id, trimmed);
      handleEditDialogChange(false);
      toast.success("Project updated successfully");
    } catch (_error) {
      toast.error("Failed to update project");
    } finally {
      setIsUpdating(false);
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
      setIsCreating(true);
      const created = await createProject(trimmedName);
      toast.success("Project created successfully");
      setProjectName("");
      handleDialogChange(false);
      if (created?.id) {
        router.push(`/project/${created.id}`);
      }
    } catch (_error) {
      toast.error("Failed to create project");
    } finally {
      setIsCreating(false);
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
      setIsDeleting(true);
      await deleteProject(projectPendingDeletion.id);
      handleDeleteDialogChange(false);
      toast.success("Project deleted successfully");
    } catch (_error) {
      toast.error("Failed to delete project");
    } finally {
      setIsDeleting(false);
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
        <div className="min-h-0 flex-1 overflow-hidden">
          {projectsLoading ? (
            <NavProjectsSkeleton />
          ) : (
            <div className="h-full overflow-auto scrollbar-thin pr-1">
              <NavProjects
                hasMore={Boolean(hasNextPage)}
                isLoadingMore={isFetchingNextPage}
                onLoadMore={() => {}}
                onRequestEdit={handleRequestEdit}
                onRequestDelete={handleRequestDelete}
                projects={projects}
              />
            </div>
          )}
        </div>
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
