"use client"

import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"
import { Progress } from "@/components/ui/progress"

export function NavSecondary({
  items,
  ...props
}) {
  return (
    <SidebarGroup {...props}>
      <SidebarGroupContent>
        <SidebarMenu>
          {items.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild size="sm">
                <a href={item.url}>
                  <item.icon />
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
        <div className="mt-4 px-2">
          <p className="text-sm text-sidebar-foreground/80">
            <span className="font-semibold text-sidebar-foreground">1.05932</span>
            /
            <span className="font-semibold text-sidebar-foreground">700</span>
            {" "}credits
          </p>
          <Progress value={45} className="mt-3 h-2" />
        </div>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}
