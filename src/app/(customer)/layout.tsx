import { DashboardShell } from "@/components/dashboard/DashboardShell";
import { ProfileProvider } from "@/contexts/ProfileContext";

export default function CustomerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ProfileProvider>
      <DashboardShell>{children}</DashboardShell>
    </ProfileProvider>
  );
}
