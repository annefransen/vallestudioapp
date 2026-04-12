"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  Home,
  CalendarPlus,
  CalendarDays,
  History,
  UserCircle,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface NavItem {
  title: string;
  href: string;
  icon: LucideIcon;
  exact?: boolean;
}

const mainNavItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home, exact: true },
  { title: "Book Appointment", href: "/dashboard/book", icon: CalendarPlus },
  {
    title: "My Appointments",
    href: "/dashboard/appointments",
    icon: CalendarDays,
  },
  { title: "History", href: "/dashboard/history", icon: History },
];

interface DashboardSidebarProps {
  collapsed?: boolean;
}

export function DashboardSidebar({ collapsed = false }: DashboardSidebarProps) {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <aside
      className={cn(
        "flex flex-col h-screen bg-white text-[#1a1a1a] border-r border-stone-200 overflow-hidden shrink-0 transition-all duration-300 ease-in-out",
        collapsed ? "w-16" : "w-64",
      )}
    >
      {/* Logo */}
      <div
        className={cn(
          "flex items-center border-b border-stone-200 h-16 transition-all duration-300",
          collapsed ? "px-4 justify-center" : "px-5 justify-center",
        )}
      >
        <Link
          href="/dashboard"
          className="transition-transform hover:scale-105 active:scale-95"
        >
          {collapsed ? (
            <div className="w-8 h-8 rounded-lg hover:bg-stone-100 flex text-[#1a1a1a] font-bold text-xs">
              <Image
                src="/img/vs-logo.png"
                alt="Valle Studio Logo"
                width={140}
                height={60}
                className="w-auto h-8"
              />
            </div>
          ) : (
            <Image
              src="/img/vs-logo.png"
              alt="Valle Studio Logo"
              width={140}
              height={60}
              className="w-auto h-15"
            />
          )}
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-0.5 overflow-y-auto overflow-x-hidden">
        {mainNavItems.map((item) => {
          const active = isActive(item);
          return (
            <Link
              key={item.href}
              href={item.href}
              title={collapsed ? item.title : undefined}
              className={cn(
                "relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group",
                collapsed ? "justify-center" : "",
                active
                  ? "bg-[#494136]/10 text-[#494136] font-semibold"
                  : "text-stone-500 hover:text-[#1a1a1a] hover:bg-stone-50",
              )}
            >
              {active && (
                <span className="absolute left-0 w-0.5 h-5 bg-[#494136] rounded-r-full" />
              )}
              <item.icon
                className={cn(
                  "w-4 h-4 shrink-0 transition-colors",
                  active
                    ? "text-[#494136]"
                    : "text-stone-400 group-hover:text-[#1a1a1a]",
                )}
              />
              {!collapsed && (
                <span className="text-sm font-medium tracking-wide whitespace-nowrap">
                  {item.title}
                </span>
              )}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
