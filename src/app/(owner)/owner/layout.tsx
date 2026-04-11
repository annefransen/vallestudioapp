import { AdminSidebar } from '@/components/admin/AdminSidebar'

export default function OwnerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-[#faf9f8]">
      {/* Reusing AdminSidebar for layout consistency, can be customized later */}
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0 lg:ml-0 pt-14 lg:pt-0">
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-auto max-w-7xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  )
}
