import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Bot, Plus, MessageSquare, MoreHorizontal, Play, Pause } from "lucide-react";
import { AGENT_ROLES, type AgentRole } from "@/types";
import Link from "next/link";

const mockAgents = [
  {
    id: "1",
    name: "Dr. Smile Receptionist",
    role: "dental_receptionist" as AgentRole,
    status: "active",
    totalConversations: 1243,
    totalMessages: 8921,
    language: "en",
    createdAt: "2024-01-15",
  },
  {
    id: "2",
    name: "PizzaBot Pro",
    role: "restaurant_ordering" as AgentRole,
    status: "active",
    totalConversations: 892,
    totalMessages: 6234,
    language: "auto",
    createdAt: "2024-01-20",
  },
  {
    id: "3",
    name: "SupportAI",
    role: "customer_support" as AgentRole,
    status: "paused",
    totalConversations: 456,
    totalMessages: 3210,
    language: "en",
    createdAt: "2024-02-01",
  },
  {
    id: "4",
    name: "SalesMax AI",
    role: "sales_agent" as AgentRole,
    status: "draft",
    totalConversations: 0,
    totalMessages: 0,
    language: "fr",
    createdAt: "2024-02-10",
  },
];

const statusConfig = {
  active: { label: "Active", variant: "success" as const, dot: "bg-emerald-500" },
  paused: { label: "Paused", variant: "warning" as const, dot: "bg-amber-500" },
  draft: { label: "Draft", variant: "secondary" as const, dot: "bg-gray-400" },
  archived: { label: "Archived", variant: "outline" as const, dot: "bg-gray-300" },
};

export function AgentsList() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <Bot className="w-4 h-4 text-violet-500" />
            My Agents
          </CardTitle>
          <Button variant="gradient" size="sm" asChild>
            <Link href="/agents/new">
              <Plus className="w-3.5 h-3.5" />
              New Agent
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {mockAgents.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
            <div className="w-16 h-16 rounded-2xl bg-violet-100 dark:bg-violet-900/20 flex items-center justify-center mb-4">
              <Bot className="w-8 h-8 text-violet-500" />
            </div>
            <h3 className="font-semibold text-foreground mb-1">No agents yet</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-xs">
              Create your first AI agent to start automating conversations.
            </p>
            <Button variant="gradient" size="sm" asChild>
              <Link href="/agents/new">
                <Plus className="w-4 h-4" />
                Create your first agent
              </Link>
            </Button>
          </div>
        ) : (
          <div className="divide-y divide-border/40">
            {mockAgents.map((agent) => {
              const role = AGENT_ROLES[agent.role];
              const status = statusConfig[agent.status as keyof typeof statusConfig];
              return (
                <div
                  key={agent.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
                >
                  {/* Icon */}
                  <div
                    className={`w-11 h-11 rounded-xl bg-gradient-to-br ${role.gradient} flex items-center justify-center text-xl shadow-sm flex-shrink-0`}
                  >
                    {role.icon}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <Link
                        href={`/agents/${agent.id}`}
                        className="font-medium text-foreground hover:text-violet-600 transition-colors"
                      >
                        {agent.name}
                      </Link>
                      <Badge variant={status.variant} className="text-xs">
                        <div className={`w-1.5 h-1.5 rounded-full ${status.dot} mr-1`} />
                        {status.label}
                      </Badge>
                    </div>
                    <div className="text-xs text-muted-foreground">
                      {role.label} • {role.industry}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="hidden md:flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {agent.totalConversations.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        Chats
                      </div>
                    </div>
                    <div className="text-center">
                      <div className="font-semibold text-foreground">
                        {agent.totalMessages.toLocaleString()}
                      </div>
                      <div className="text-xs text-muted-foreground">Messages</div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      {agent.status === "active" ? (
                        <Pause className="w-3.5 h-3.5 text-muted-foreground" />
                      ) : (
                        <Play className="w-3.5 h-3.5 text-muted-foreground" />
                      )}
                    </Button>
                    <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                      <Link href={`/agents/${agent.id}`}>
                        <MoreHorizontal className="w-3.5 h-3.5 text-muted-foreground" />
                      </Link>
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
