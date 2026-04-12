"use client";

import * as React from "react";
import {
  PanelLeftClose,
  PanelLeftOpen,
  User,
  LogOut,
  Settings,
  Circle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/DropdownMenu";
import { Button } from "@/components/ui/Button";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

interface TopBarProps {
  onToggleSidebar: () => void;
  collapsed?: boolean;
  userName?: string;
  userEmail?: string;
  avatarUrl?: string | null;
}

export function DashboardTopBar({
  onToggleSidebar,
  collapsed = false,
  userName,
  userEmail,
  avatarUrl,
}: TopBarProps) {
  const router = useRouter();
  const supabase = createClient();

  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      toast.error("Failed to logout");
      return;
    }
    toast.success("Logged out successfully");
    router.push("/login");
  };

  return (
    <header className="h-16 border-b border-stone-200 bg-white/95 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Sidebar Toggle — desktop only */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-stone-50 flex items-center justify-center rounded-lg cursor-pointer text-stone-500 hover:text-[#1a1a1a]"
        >
          {collapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </Button>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-3">

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button
                variant="ghost"
                className="flex items-center gap-2 pl-2 pr-1 hover:bg-stone-50 rounded-sm focus-visible:ring-0 cursor-pointer transition-colors"
              >
                <div className="w-8 h-8 rounded-full bg-[#494136]/10 flex items-center justify-center text-[#494136] font-bold text-xs border border-[#494136]/20 overflow-hidden">
                  {avatarUrl ? (
                    <img
                      src={avatarUrl}
                      alt={userName}
                      className="w-full h-full object-cover"
                    />
                  ) : userName ? (
                    userName.charAt(0).toUpperCase()
                  ) : (
                    <User className="w-4 h-4 " />
                  )}
                </div>
                <span className="text-sm font-semibold hidden md:block text-[#1a1a1a]">
                  {userName || "Customer"}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">
                    {userName || "Customer"}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {userEmail}
                  </p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
            >
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => router.push("/dashboard/profile")}
              className="cursor-pointer"
            >
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleLogout}
              className="text-red-500 focus:text-red-500 cursor-pointer"
            >
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
