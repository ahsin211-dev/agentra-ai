export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { AnalyticsDashboard } from "@/components/analytics/analytics-dashboard";

export const metadata = { title: "Analytics" };

export default function AnalyticsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Analytics"
        description="Insights across all your AI agents and conversations"
      />
      <div className="flex-1 p-6">
        <AnalyticsDashboard />
      </div>
    </div>
  );
}
