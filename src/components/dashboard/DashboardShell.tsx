"use client";

import * as React from "react";
import { DashboardSidebar } from "@/components/layout/CustomerSidebar";
import { DashboardTopBar } from "@/components/layout/TopBar";
import { MobileBottomNav } from "./MobileBottomNav";
import { useProfile } from "@/contexts/ProfileContext";
export interface Profile {
  first_name?: string;
  email?: string;
  [key: string]: unknown;
}


export function DashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const { profile } = useProfile();

  return (
    <div className="flex h-screen bg-muted/20 overflow-hidden">
      {/* Desktop Sidebar — hidden on mobile */}
      <div className="hidden md:block">
        <DashboardSidebar collapsed={collapsed} />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardTopBar
          collapsed={collapsed}
          onToggleSidebar={() => setCollapsed(!collapsed)}
          userName={profile?.first_name}
          userEmail={profile?.gmail}
          avatarUrl={profile?.avatar_url}
        />

        {/* Main scrollable area — add bottom padding on mobile for the bottom nav */}
        <main className="flex-1 overflow-y-auto px-3 py-4 md:p-8 bg-linear-to-br from-muted/5 to-background pb-20 md:pb-8">
          <div className="max-w-7xl mx-auto h-full">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Navigation — hidden on desktop */}
      <MobileBottomNav />
    </div>
  );
}
