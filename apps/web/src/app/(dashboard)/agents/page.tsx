export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { AgentsList } from "@/components/agents/agents-list";

export const metadata = { title: "My Agents" };

export default function AgentsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="My Agents"
        description="Manage and monitor your AI agents"
        action={{ label: "New Agent", href: "/agents/new" }}
      />
      <div className="flex-1 p-6">
        <AgentsList />
      </div>
    </div>
  );
}
