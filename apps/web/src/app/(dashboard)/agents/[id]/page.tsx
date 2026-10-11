import { DashboardHeader } from "@/components/layout/header";
import { AgentDetailView } from "@/components/agents/agent-detail";

export const metadata = {
  title: "Agent Details",
};

export default async function AgentDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader title="Agent Details" />
      <div className="flex-1 p-6">
        <AgentDetailView agentId={id} />
      </div>
    </div>
  );
}
