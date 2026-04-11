"use client";

import * as React from "react";
import { Bell, PanelLeftClose, PanelLeftOpen, User, LogOut, Settings } from "lucide-react";
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
}

export function DashboardTopBar({ onToggleSidebar, collapsed = false, userName, userEmail }: TopBarProps) {
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
    <header className="h-16 border-b border-border bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-30">
      {/* Left: Sidebar Toggle — desktop only */}
      <div className="hidden md:flex items-center gap-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={onToggleSidebar}
          className="hover:bg-muted flex items-center justify-center rounded-lg"
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
        {/* Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="ghost" size="icon" className="relative hover:bg-muted">
                <Bell className="w-5 h-5 text-muted-foreground" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-80 mt-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel>Notifications</DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <div className="max-h-64 overflow-y-auto">
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  <span className="font-semibold text-xs">New Appointment</span>
                </div>
                <p className="text-xs text-muted-foreground">Your booking for Hair Styling has been confirmed for tomorrow at 10:00 AM.</p>
                <span className="text-[10px] text-muted-foreground/60">2 hours ago</span>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="flex flex-col items-start gap-1 p-3 cursor-pointer">
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full" />
                  <span className="font-semibold text-xs">Payment Successful</span>
                </div>
                <p className="text-xs text-muted-foreground">Successfully paid ₱850 for your last visit.</p>
                <span className="text-[10px] text-muted-foreground/60">1 day ago</span>
              </DropdownMenuItem>
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="justify-center text-xs font-medium text-[#494136] hover:text-black cursor-pointer">
              View all notifications
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger 
            render={
              <Button variant="ghost" className="flex items-center gap-2 pl-2 pr-1 hover:bg-muted rounded-full focus-visible:ring-0">
                <div className="w-8 h-8 rounded-full bg-[#494136]/10 flex items-center justify-center text-[#494136] font-bold text-xs border border-[#494136]/20 overflow-hidden">
                  {userName ? userName.charAt(0).toUpperCase() : <User className="w-4 h-4" />}
                </div>
                <span className="text-sm font-medium text-foreground hidden md:block">
                  {userName || "Customer"}
                </span>
              </Button>
            }
          />
          <DropdownMenuContent align="end" className="w-56 mt-2">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal">
                <div className="flex flex-col space-y-1">
                  <p className="text-sm font-semibold">{userName || "Customer"}</p>
                  <p className="text-xs text-muted-foreground truncate">{userEmail}</p>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
              <User className="mr-2 h-4 w-4" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => router.push("/dashboard/settings")} className="cursor-pointer">
              <Settings className="mr-2 h-4 w-4" />
              <span>Settings</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout} className="text-red-500 focus:text-red-500 cursor-pointer">
              <LogOut className="mr-2 h-4 w-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
