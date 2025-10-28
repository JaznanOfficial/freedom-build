"use client";

import { Folder, Loader2, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export function NavProjects({
  projects,
  hasMore,
  onLoadMore,
  isLoadingMore,
  onRequestEdit,
  onRequestDelete,
}) {
  const { isMobile } = useSidebar();

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {projects.length === 0 ? (
          <SidebarMenuItem>
            <SidebarMenuButton disabled>
              <span className="text-muted-foreground">No projects yet</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ) : (
          projects.map((item) => {
            const Icon = item.icon ?? Folder;
            const href = item.url ?? (item.id ? `/projects/${item.id}` : "#");

            return (
              <SidebarMenuItem key={item.id ?? item.name}>
                <SidebarMenuButton asChild>
                  <Link href={href}>
                    <Icon />
                    <span>{item.name}</span>
                  </Link>
                </SidebarMenuButton>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <SidebarMenuAction
                      showOnHover
                      className="bg-sidebar-primary text-secondary hover:bg-sidebar-primary hover:text-secondary peer-hover/menu-button:text-secondary"
                    >
                      <MoreHorizontal className="text-secondary" />
                      <span className="sr-only">More</span>
                    </SidebarMenuAction>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={isMobile ? "end" : "start"}
                    className="w-48"
                    side={isMobile ? "bottom" : "right"}
                  >
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        onRequestEdit?.(item);
                      }}
                    >
                      <Pencil className="text-muted-foreground" />
                      <span>Edit</span>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(event) => {
                        event.preventDefault();
                        onRequestDelete?.(item);
                      }}
                      variant="destructive"
                    >
                      <Trash2 />
                      <span>Delete Project</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </SidebarMenuItem>
            );
          })
        )}
        {hasMore && (
          <SidebarMenuItem>
            <SidebarMenuButton disabled={isLoadingMore} onClick={onLoadMore}>
              {isLoadingMore ? (
                <Loader2 className="animate-spin" />
              ) : (
                <MoreHorizontal />
              )}
              <span>{isLoadingMore ? "Loading more" : "More"}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        )}
      </SidebarMenu>
    </SidebarGroup>
  );
}
