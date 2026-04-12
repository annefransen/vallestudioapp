"use client";

import * as React from "react";
import Link from "next/link";
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

const navItems: NavItem[] = [
  { title: "Home", href: "/dashboard", icon: Home, exact: true },
  { title: "Book", href: "/dashboard/book", icon: CalendarPlus },
  { title: "Appts", href: "/dashboard/appointments", icon: CalendarDays },
  { title: "History", href: "/dashboard/history", icon: History },
  { title: "Profile", href: "/dashboard/profile", icon: UserCircle },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  const isActive = (item: NavItem) => {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#494136] border-t border-[#fafafa]/10 flex items-center justify-around h-16 px-1 safe-area-bottom">
      {navItems.map((item) => {
        const active = isActive(item);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-150",
              active
                ? "text-[#fafafa]"
                : "text-[#fafafa]/45 hover:text-[#fafafa]/75"
            )}
          >
            <item.icon
              className={cn("w-5 h-5", active && "scale-105")}
            />
            <span className="text-[9px] font-medium tracking-wide">
              {item.title}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
