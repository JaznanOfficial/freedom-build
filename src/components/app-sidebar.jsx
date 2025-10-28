"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { Coins, Command, LifeBuoy, Plus, Send } from "lucide-react";

import { NavProjects } from "@/components/nav-projects";
import { NavProjectsSkeleton } from "@/components/loader-skeletons/nav-projects-skeleton";
import { NavSecondary } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import { useCreateProject, useProjects } from "@/hooks/queries/projects";
import { Button } from "@/components/ui/button";
import {
  Dialog,
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

  const {
    data,
    isLoading: projectsLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useProjects();

  const projects = data?.pages.flatMap((page) => page?.data ?? []) ?? [];

  const { mutateAsync: createProject, isPending: isCreating } = useCreateProject();

  const handleDialogChange = (open) => {
    setDialogOpen(open);
    if (!open) {
      setProjectName("");
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
    } catch (error) {
      console.error("[AppSidebar] create project failed", error);
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
          <Dialog open={dialogOpen} onOpenChange={handleDialogChange}>
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
                    id="project-name"
                    onChange={(event) => setProjectName(event.target.value)}
                    placeholder="Enter project name"
                    value={projectName}
                    disabled={isCreating}
                  />
                </div>
                <DialogFooter>
                  <Button className="w-full" disabled={isCreating} type="submit">
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
            projects={projects}
            hasMore={Boolean(hasNextPage)}
            onLoadMore={() => fetchNextPage()}
            isLoadingMore={isFetchingNextPage}
          />
        )}
        <NavSecondary className="mt-auto" items={secondaryNavItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}
