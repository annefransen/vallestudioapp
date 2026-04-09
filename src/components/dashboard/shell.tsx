"use client";

import * as React from "react";
import { DashboardSidebar } from "./sidebar";
import { DashboardTopBar } from "./top-bar";
import { MobileBottomNav } from "./mobile-bottom-nav";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";

export function CustomerDashboardShell({
  children,
}: {
  children: React.ReactNode;
}) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [profile, setProfile] = React.useState<any>(null);
  const supabase = createClient();

  React.useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase
          .from("profiles")
          .select("*")
          .eq("profile_id", user.id)
          .single();
        setProfile({ ...data, email: user.email });
      }
    };
    fetchProfile();
  }, [supabase]);

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
          userEmail={profile?.email}
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
