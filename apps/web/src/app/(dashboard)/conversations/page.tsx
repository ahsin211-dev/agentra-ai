export const dynamic = "force-dynamic";

import { DashboardHeader } from "@/components/layout/header";
import { ConversationsList } from "@/components/conversations/conversations-list";

export const metadata = { title: "Conversations" };

export default function ConversationsPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Conversations"
        description="All conversations across your AI agents"
      />
      <div className="flex-1 p-6">
        <ConversationsList />
      </div>
    </div>
  );
}
