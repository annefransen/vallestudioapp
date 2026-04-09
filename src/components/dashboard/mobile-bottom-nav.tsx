"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Sparkles, History, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { title: "Home", href: "/dashboard", icon: Home },
  { title: "Services", href: "/dashboard/services", icon: Sparkles },
  { title: "History", href: "/dashboard/history", icon: History },
  { title: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function MobileBottomNav() {
  const pathname = usePathname();

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden bg-[#494136] border-t border-[#fafafa]/10 flex items-center justify-around h-16 px-2 safe-area-bottom">
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "flex flex-col items-center justify-center gap-1 flex-1 h-full transition-all duration-200",
              isActive ? "text-[#fafafa]" : "text-[#fafafa]/50 hover:text-[#fafafa]/80"
            )}
          >
            <item.icon className={cn("w-5 h-5", isActive && "scale-110")} />
            <span className="text-[10px] font-medium tracking-wide">
              {item.title}
            </span>
            {isActive && (
              <span className="absolute top-0 w-8 h-0.5 bg-[#fafafa] rounded-full" />
            )}
          </Link>
        );
      })}
    </nav>
  );
}
