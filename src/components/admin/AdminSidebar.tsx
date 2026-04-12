'use client'

import Link from 'next/link'
import Image from 'next/image'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard, BarChart3, CalendarCheck, Users, History,
  CalendarDays, Scissors, Tag, ImageIcon, Users2,
  UserRoundCheck, CreditCard, X
} from 'lucide-react'
import { cn } from '@/lib/utils'

const NAV_ITEMS = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard, exact: true },
  { href: '/admin/performance', label: 'Performance', icon: BarChart3 },
  { href: '/admin/reservations', label: 'Reservation', icon: CalendarCheck },
  { href: '/admin/walk-ins', label: 'Walk-Ins Queue', icon: Users },
  { href: '/admin/walk-ins?view=history', label: 'Walk-In History', icon: History },
  { href: '/admin/stylists', label: 'Stylist Schedule', icon: CalendarDays },
  { href: '/admin/services', label: 'Services', icon: Scissors },
  { href: '/admin/promotions', label: 'Promos', icon: Tag },
  { href: '/admin/gallery', label: 'Gallery', icon: ImageIcon },
  { href: '/admin/customers', label: 'Customers', icon: Users2 },
  { href: '/admin/staff', label: 'Staff', icon: UserRoundCheck },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
]

interface NavContentProps {
  collapsed: boolean
  pathname: string
  setMobileOpen: (open: boolean) => void
}

function NavContent({ collapsed, pathname, setMobileOpen }: NavContentProps) {
  const isActive = (item: typeof NAV_ITEMS[0]) => {
    const [path] = item.href.split('?')
    if (item.exact) return pathname === path
    return pathname.startsWith(path)
  }

  return (
    <div className="flex flex-col h-full bg-white font-sans">
      {/* Brand */}
      <div className={cn(
        "px-5 py-6 border-b border-zinc-100 transition-all duration-300",
        collapsed ? "px-0 flex justify-center" : "px-5"
      )}>
        <Link href="/admin" className="flex items-center gap-3 active:scale-95 transition-transform">
          <div className={cn(
            "rounded-xl overflow-hidden bg-zinc-900 flex items-center justify-center shadow-lg shadow-zinc-200 shrink-0",
            collapsed ? "w-9 h-9" : "w-10 h-10"
          )}>
            <Image 
              src="/img/vs-logo.png" 
              alt="Valle Studio" 
              width={40} 
              height={40} 
              className="w-full h-full object-cover" 
            />
          </div>
          {!collapsed && (
            <div className="animate-in fade-in duration-500">
              <p className="text-[14px] font-bold text-zinc-900 tracking-tight leading-none">Valle Studio</p>
              <p className="text-[10px] text-zinc-400 font-bold uppercase tracking-widest mt-1">Super Admin</p>
            </div>
          )}
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-6 space-y-1 overflow-y-auto no-scrollbar">
        {NAV_ITEMS.map((item) => {
          const active = isActive(item)
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileOpen(false)}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all duration-200 group relative',
                active
                  ? 'bg-zinc-900 text-white shadow-md shadow-zinc-200'
                  : 'text-zinc-500 hover:bg-zinc-50 hover:text-zinc-900',
                collapsed && "justify-center px-2"
              )}
            >
              <item.icon className={cn(
                'w-[18px] h-[18px] shrink-0 transition-colors',
                active ? 'text-white' : 'text-zinc-400 group-hover:text-zinc-600'
              )} />
              
              {!collapsed && (
                <span className="flex-1 truncate">{item.label}</span>
              )}

              {active && !collapsed && (
                <div className="w-1 h-4 bg-white/20 rounded-full absolute right-3" />
              )}

              {collapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-zinc-900 text-white text-[10px] rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity z-50 whitespace-nowrap">
                  {item.label}
                </div>
              )}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}

interface AdminSidebarProps {
  collapsed: boolean
  mobileOpen: boolean
  setMobileOpen: (open: boolean) => void
}

export function AdminSidebar({ collapsed, mobileOpen, setMobileOpen }: AdminSidebarProps) {
  const pathname = usePathname()

  return (
    <>
      {/* Desktop */}
      <aside className={cn(
        "hidden lg:flex flex-col bg-white border-r border-zinc-100 shrink-0 h-screen sticky top-0 z-30 transition-[width] duration-300 ease-in-out",
        collapsed ? "w-20" : "w-64"
      )}>
        <NavContent collapsed={collapsed} pathname={pathname} setMobileOpen={setMobileOpen} />
      </aside>

      {/* Mobile Drawer */}
      <div className={cn(
        "lg:hidden fixed inset-0 z-100 transition-opacity duration-300",
        mobileOpen ? "opacity-100" : "opacity-0 pointer-events-none"
      )}>
        <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-sm" onClick={() => setMobileOpen(false)} />
        <div className={cn(
          "absolute left-0 top-0 bottom-0 w-64 bg-white shadow-2xl transition-transform duration-300 ease-out",
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          <div className="flex justify-end p-4 lg:hidden">
            <button onClick={() => setMobileOpen(false)} className="p-2 text-zinc-400"><X className="w-6 h-6" /></button>
          </div>
          <NavContent collapsed={collapsed} pathname={pathname} setMobileOpen={setMobileOpen} />
        </div>
      </div>
    </>
  )
}


