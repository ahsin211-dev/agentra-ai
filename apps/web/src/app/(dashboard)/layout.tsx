import { Sidebar } from "@/components/layout/sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-gray-50/50 dark:bg-gray-950">
      <Sidebar />
      <main className="flex-1 lg:ml-60 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}
