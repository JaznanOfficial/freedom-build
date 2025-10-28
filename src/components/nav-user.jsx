/** biome-ignore-all lint/style/useBlockStatements: <explanation> */
"use client";

import { UserButton, useUser } from "@clerk/nextjs";
import { ChevronsUpDown } from "lucide-react";
import { useRef } from "react";

import { NavUserSkeleton } from "@/components/loader-skeletons/nav-user-skeleton";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SidebarMenu, SidebarMenuItem } from "@/components/ui/sidebar";

export function NavUser() {
  const { isLoaded, user } = useUser();
  const userButtonRef = useRef(null);

  const handleUserButtonClick = () => {
    // Try multiple approaches to trigger the UserButton
    const userButtonElement =
      userButtonRef.current?.querySelector("button") ||
      userButtonRef.current?.querySelector('[role="button"]') ||
      document.querySelector("[data-clerk-user-button] button") ||
      document.querySelector(".cl-userButton-trigger");

    if (userButtonElement) {
      userButtonElement.click();
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      handleUserButtonClick();
    }
  };

  if (!isLoaded) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <NavUserSkeleton />
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <div className="relative">
          {/* Hidden UserButton for functionality */}
          <div
            className="pointer-events-none absolute opacity-0"
            ref={userButtonRef}
          >
            <UserButton
              appearance={{
                elements: {
                  userButtonAvatarBox: "w-8 h-8",
                  userButtonPopoverCard: "min-w-56",
                  userButtonPopoverActionButton: "flex items-center gap-2",
                },
              }}
            >
              <UserButton.UserProfilePage label="account" />
              <UserButton.UserProfilePage label="security" />
            </UserButton>
          </div>

          {/* Custom display area that shows user info */}
          <button
            aria-label="Open user menu"
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-1 py-1.5 text-left text-sm transition-colors hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
            onClick={handleUserButtonClick}
            onKeyDown={handleKeyDown}
            type="button"
          >
            <Avatar className="h-8 w-8 rounded-lg">
              <AvatarImage alt={user.fullName} src={user.imageUrl} />
              <AvatarFallback className="rounded-lg">
                {user.firstName?.charAt(0)}
                {user.lastName?.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div className="grid flex-1 text-left text-sm leading-tight">
              <span className="truncate font-medium">{user.fullName}</span>
              <span className="truncate text-muted-foreground text-xs">
                {user.primaryEmailAddress?.emailAddress}
              </span>
            </div>
            <ChevronsUpDown className="ml-auto size-4" />
          </button>
        </div>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}
