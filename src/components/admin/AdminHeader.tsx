'use client'

import { PanelLeftOpen, PanelLeftClose, LogOut, User, Menu } from 'lucide-react'
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuGroup,
  DropdownMenuItem, 
  DropdownMenuLabel, 
  DropdownMenuSeparator, 
  DropdownMenuTrigger 
} from '@/components/ui/DropdownMenu'
import { Badge } from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

interface AdminHeaderProps {
  onToggleSidebar: () => void
  onOpenMobileNav: () => void
  isSidebarCollapsed: boolean
}

export function AdminHeader({ onToggleSidebar, onOpenMobileNav, isSidebarCollapsed }: AdminHeaderProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  return (
    <header className="h-14 border-b border-zinc-100 bg-white flex items-center justify-between px-4 lg:px-6 shrink-0 sticky top-0 z-20">
      <div className="flex items-center gap-3">
        {/* Mobile Toggle */}
        <button
          onClick={onOpenMobileNav}
          className="lg:hidden p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          aria-label="Open navigation"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Desktop Toggle */}
        <button
          onClick={onToggleSidebar}
          className="hidden lg:flex p-1.5 rounded-md text-zinc-500 hover:bg-zinc-100 hover:text-zinc-900 transition-colors"
          aria-label={isSidebarCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isSidebarCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <PanelLeftClose className="w-5 h-5" />
          )}
        </button>
      </div>

      <div className="flex items-center gap-4">
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center outline-none group">
            <div className="w-9 h-9 rounded-xl bg-zinc-900 text-white flex items-center justify-center text-[11px] font-bold shadow-md group-hover:bg-zinc-800 transition-all active:scale-95">
              AU
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 mt-1">
            <DropdownMenuGroup>
              <DropdownMenuLabel className="font-normal py-2">
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-semibold text-zinc-900 truncate">My Account</p>
                  <Badge variant="secondary" className="text-[10px] h-4.5 px-1.5 bg-zinc-100 text-zinc-600 border-zinc-200 shrink-0">
                    Superadmin
                  </Badge>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="cursor-pointer gap-2" onClick={() => router.push('/admin/profile')}>
              <User className="w-4 h-4 text-zinc-400" />
              <span>Profile</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem 
              className="cursor-pointer gap-2 text-red-600 focus:text-red-600 focus:bg-red-50" 
              onClick={handleSignOut}
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  )
}
