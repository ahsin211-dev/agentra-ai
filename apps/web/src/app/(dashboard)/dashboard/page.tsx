export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { StatsCards } from "@/components/analytics/stats-cards";
import { RecentConversations } from "@/components/analytics/recent-conversations";
import { AgentsList } from "@/components/agents/agents-list";
import { QuickStartCard } from "@/components/dashboard/quick-start";

export const metadata = {
  title: "Dashboard",
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Dashboard"
        description="Welcome back! Here's what's happening with your agents."
        action={{ label: "New Agent", href: "/agents/new" }}
      />

      <div className="flex-1 p-6 space-y-6">
        {/* Stats */}
        <StatsCards />

        {/* Main grid */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Agents list - 2/3 */}
          <div className="xl:col-span-2 space-y-6">
            <AgentsList />
          </div>

          {/* Right sidebar - 1/3 */}
          <div className="space-y-6">
            <QuickStartCard />
            <RecentConversations />
          </div>
        </div>
      </div>
    </div>
  );
}
