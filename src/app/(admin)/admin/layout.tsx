'use client'

import { useState } from 'react'
import { AdminSidebar } from '@/components/admin/AdminSidebar'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { cn } from '@/lib/utils'

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [collapsed, setCollapsed] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <div className="flex min-h-screen bg-zinc-50/50">
      <AdminSidebar 
        collapsed={collapsed} 
        mobileOpen={mobileOpen}
        setMobileOpen={setMobileOpen}
      />
      
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader 
          onToggleSidebar={() => setCollapsed(!collapsed)} 
          onOpenMobileNav={() => setMobileOpen(true)}
          isSidebarCollapsed={collapsed}
        />

        <main className={cn(
          "flex-1 p-4 lg:p-8 overflow-auto transition-[padding] duration-300 ease-in-out",
          collapsed ? "lg:px-12" : "lg:px-8"
        )}>
          <div className="max-w-[1400px] mx-auto">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}
