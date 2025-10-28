"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

const PLACEHOLDER_ITEMS = [
  { id: "alpha" },
  { id: "beta" },
  { id: "gamma" },
  { id: "delta" },
];

export function NavProjectsSkeleton() {
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Projects</SidebarGroupLabel>
      <SidebarMenu>
        {PLACEHOLDER_ITEMS.map((item) => (
          <SidebarMenuItem key={item.id}>
            <SidebarMenuButton disabled>
              <Skeleton className="size-4 shrink-0 rounded-full" />
              <Skeleton className="h-3 w-32 rounded-full" />
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarGroup>
  );
}
