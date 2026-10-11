export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { KnowledgeBaseView } from "@/components/knowledge/knowledge-base-view";

export const metadata = { title: "Knowledge Base" };

export default function KnowledgePage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Knowledge Base"
        description="Upload documents and data to train your AI agents"
        action={{ label: "Upload Document", href: "#" }}
      />
      <div className="flex-1 p-6">
        <KnowledgeBaseView />
      </div>
    </div>
  );
}
