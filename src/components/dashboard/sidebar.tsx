"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles,
  History,
  Settings,
  Calendar as CalendarIcon,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Calendar } from "@/components/ui/calendar";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Services", href: "/dashboard/services", icon: Sparkles },
  { title: "History", href: "/dashboard/history", icon: History },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
}

export function DashboardSidebar({ collapsed = false }: DashboardSidebarProps) {
  const pathname = usePathname();
  const [date, setDate] = React.useState<Date | undefined>(new Date());

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-[#494136] text-[#fafafa] border-r border-[#fafafa]/10 overflow-hidden shrink-0 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64"
      )}
    >
      {/* Logo Section */}
      <div
        className={cn(
          "flex items-center transition-all duration-300",
          collapsed ? "p-4 justify-center" : "p-6 justify-center"
        )}
      >
        <Link
          href="/dashboard"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg bg-[#fafafa]/20 flex items-center justify-center text-[#fafafa] font-bold text-sm">
              VS
            </div>
          ) : (
            <Image
              src="/img/vs-logo.png"
              alt="Valle Studio Logo"
              width={140}
              height={60}
              className="w-auto h-12 invert brightness-0"
            />
          )}
        </Link>
      </div>

      {/* Main Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
        {mainNavItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
                collapsed ? "justify-center" : "",
                isActive
                  ? "bg-[#fafafa]/10 text-[#fafafa] font-semibold"
                  : "text-[#fafafa]/60 hover:text-[#fafafa] hover:bg-[#fafafa]/5"
              )}
            >
              <item.icon
                className={cn(
                  "w-5 h-5 transition-colors shrink-0",
                  isActive
                    ? "text-[#fafafa]"
                    : "text-[#fafafa]/60 group-hover:text-[#fafafa]"
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                  {item.title}
                </span>
              )}
              {isActive && (
                <div className="absolute left-0 w-1 h-6 bg-[#fafafa] rounded-r-full" />
              )}
            </Link>
          );
        })}

        {/* Calendar section — only show when expanded */}
        {!collapsed && (
          <div className="mt-8 pt-8 border-t border-[#fafafa]/10">
            <div className="px-4 mb-4 flex items-center gap-2 text-[#fafafa]/40 uppercase text-[10px] font-bold tracking-[0.2em]">
              <CalendarIcon className="w-3 h-3" />
              <span>Calendar</span>
            </div>
            <div className="flex justify-center px-1 scale-[0.85] origin-top">
              <Calendar
                mode="single"
                selected={date}
                onSelect={setDate}
                className="rounded-xl border border-[#fafafa]/5 bg-[#fafafa]/5 text-[#fafafa]"
                classNames={{
                  month: "text-[#fafafa]",
                  caption_label: "text-[#fafafa] font-bold",
                  weekday: "text-[#fafafa]/50 font-bold",
                  day: "text-[#fafafa] hover:bg-[#fafafa]/20 rounded-lg",
                  day_button: "text-[#fafafa] hover:bg-[#fafafa]/20",
                  today:
                    "bg-[#fafafa]/20 text-[#fafafa] font-bold ring-1 ring-[#fafafa]/40",
                  button_previous:
                    "text-[#fafafa]/60 hover:text-[#fafafa]",
                  button_next: "text-[#fafafa]/60 hover:text-[#fafafa]",
                  outside: "text-[#fafafa]/20 opacity-50",
                }}
              />
            </div>
          </div>
        )}

        {/* Collapsed calendar icon */}
        {collapsed && (
          <div className="mt-4 pt-4 border-t border-[#fafafa]/10 flex justify-center">
            <div
              title="Calendar"
              className="p-3 rounded-lg text-[#fafafa]/60 hover:text-[#fafafa] hover:bg-[#fafafa]/5 transition-colors cursor-pointer"
            >
              <CalendarIcon className="w-5 h-5" />
            </div>
          </div>
        )}
      </nav>

      {/* Bottom Navigation — Settings */}
      <div className="p-2 border-t border-[#fafafa]/10">
        <Link
          href="/dashboard/settings"
          title={collapsed ? "Settings" : undefined}
          className={cn(
            "flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 group relative",
            collapsed ? "justify-center" : "",
            pathname === "/dashboard/settings"
              ? "bg-[#fafafa]/10 text-[#fafafa] font-semibold"
              : "text-[#fafafa]/60 hover:text-[#fafafa] hover:bg-[#fafafa]/5"
          )}
        >
          <Settings
            className={cn(
              "w-5 h-5 transition-colors shrink-0",
              pathname === "/dashboard/settings"
                ? "text-[#fafafa]"
                : "text-[#fafafa]/60 group-hover:text-[#fafafa]"
            )}
          />
          {!collapsed && (
            <span className="text-sm font-medium tracking-wide">Settings</span>
          )}
          {pathname === "/dashboard/settings" && (
            <div className="absolute left-0 w-1 h-6 bg-[#fafafa] rounded-r-full" />
          )}
        </Link>
      </div>
    </aside>
  );
}
