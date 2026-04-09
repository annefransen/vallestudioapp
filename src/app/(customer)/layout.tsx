import { CustomerDashboardShell } from '@/components/dashboard/shell'

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <CustomerDashboardShell>
      {children}
    </CustomerDashboardShell>
  )
}
