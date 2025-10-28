"use client"

import Link from "next/link"
import {
  Command,
  Frame as FrameIcon,
  LifeBuoy,
  Map as MapIcon,
  PieChart as PieChartIcon,
  Send,
  Coins,
  Plus,
} from "lucide-react"

import { NavProjects } from "@/components/nav-projects"
import { NavSecondary } from "@/components/nav-secondary"
import { NavUser } from "@/components/nav-user"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

const data = {
  user: {
    name: "shadcn",
    email: "m@example.com",
    avatar: "/avatars/shadcn.jpg",
  },
  navSecondary: [
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
  ],
  projects: [
    {
      name: "Design Engineering",
      url: "/projects/design-engineering",
      icon: FrameIcon,
    },
    {
      name: "Sales & Marketing",
      url: "/projects/sales-marketing",
      icon: PieChartIcon,
    },
    {
      name: "Travel",
      url: "/projects/travel",
      icon: MapIcon,
    },
  ],
}

export function AppSidebar({
  ...props
}) {
  return (
    <Sidebar variant="inset" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div
                  className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg">
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
          <Dialog>
            <DialogTrigger asChild>
              <Button className="w-full" variant="default">
                <Plus className="size-4" />
                <span>Create Project</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create a new project</DialogTitle>
                <DialogDescription>
                  Name your project to get started with a fresh workspace.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-2">
                <label className="text-sm font-medium" htmlFor="project-name">
                  Project name
                </label>
                <Input id="project-name" placeholder="Enter project name" />
              </div>
              <DialogFooter>
                <Button asChild>
                  <Link href="/projects/new">Create &amp; Go to the project</Link>
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        <NavProjects projects={data.projects} />
        <NavSecondary items={data.navSecondary} className="mt-auto" />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
    </Sidebar>
  );
}
