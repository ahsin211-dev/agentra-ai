"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { AGENT_ROLES, type AgentRole } from "@/types";
import { Search, MessageSquare, Clock, Globe2, ExternalLink } from "lucide-react";
import { formatRelativeTime } from "@/lib/utils";
import Link from "next/link";

const mockConversations = [
  {
    id: "conv-1",
    agentId: "1",
    agentName: "Dr. Smile Receptionist",
    agentRole: "dental_receptionist" as AgentRole,
    customerName: "Ahmed Al-Rashidi",
    language: "EN",
    channel: "web",
    status: "active",
    messageCount: 12,
    lastMessage: "I would like to book an appointment for next Tuesday morning.",
    startedAt: new Date(Date.now() - 5 * 60000),
  },
  {
    id: "conv-2",
    agentId: "2",
    agentName: "PizzaBot Pro",
    agentRole: "restaurant_ordering" as AgentRole,
    customerName: "Fatima Hassan",
    language: "AR",
    channel: "web",
    status: "completed",
    messageCount: 8,
    lastMessage: "شكراً، سأنتظر طلبي",
    startedAt: new Date(Date.now() - 25 * 60000),
  },
  {
    id: "conv-3",
    agentId: "3",
    agentName: "SupportAI",
    agentRole: "customer_support" as AgentRole,
    customerName: "James Wilson",
    language: "EN",
    channel: "voice",
    status: "completed",
    messageCount: 15,
    lastMessage: "Thank you for resolving my issue so quickly!",
    startedAt: new Date(Date.now() - 2 * 3600000),
  },
  {
    id: "conv-4",
    agentId: "1",
    agentName: "Dr. Smile Receptionist",
    agentRole: "dental_receptionist" as AgentRole,
    customerName: "Marie Dupont",
    language: "FR",
    channel: "web",
    status: "completed",
    messageCount: 6,
    lastMessage: "Merci, à bientôt!",
    startedAt: new Date(Date.now() - 5 * 3600000),
  },
  {
    id: "conv-5",
    agentId: "2",
    agentName: "PizzaBot Pro",
    agentRole: "restaurant_ordering" as AgentRole,
    customerName: "Anonymous",
    language: "EN",
    channel: "api",
    status: "abandoned",
    messageCount: 2,
    lastMessage: "Do you have vegetarian options?",
    startedAt: new Date(Date.now() - 24 * 3600000),
  },
];

const statusConfig = {
  active: { label: "Active", variant: "success" as const },
  completed: { label: "Completed", variant: "secondary" as const },
  abandoned: { label: "Abandoned", variant: "outline" as const },
};

const channelEmoji: Record<string, string> = {
  web: "🌐",
  voice: "🎙️",
  api: "⚡",
  whatsapp: "💬",
};

export function ConversationsList() {
  const [search, setSearch] = useState("");

  const filtered = mockConversations.filter(
    (c) =>
      c.customerName.toLowerCase().includes(search.toLowerCase()) ||
      c.agentName.toLowerCase().includes(search.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search conversations..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="text-sm text-muted-foreground">
          {filtered.length} conversations
        </div>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            All Conversations
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="divide-y divide-border/40">
            {filtered.map((conv) => {
              const roleConfig = AGENT_ROLES[conv.agentRole];
              const status = statusConfig[conv.status as keyof typeof statusConfig];
              return (
                <div
                  key={conv.id}
                  className="flex items-center gap-4 px-6 py-4 hover:bg-muted/40 transition-colors group"
                >
                  {/* Agent icon */}
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-lg flex-shrink-0`}
                  >
                    {roleConfig.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="font-medium text-sm text-foreground">
                        {conv.customerName}
                      </span>
                      <span className="text-xs text-muted-foreground">→ {conv.agentName}</span>
                    </div>
                    <p className="text-xs text-muted-foreground truncate max-w-md">
                      {conv.lastMessage}
                    </p>
                  </div>

                  {/* Meta */}
                  <div className="flex items-center gap-3 text-xs text-muted-foreground flex-shrink-0">
                    <span className="flex items-center gap-1">
                      <span>{channelEmoji[conv.channel]}</span>
                      <span className="capitalize">{conv.channel}</span>
                    </span>
                    <span className="px-1.5 py-0.5 rounded bg-muted font-mono">
                      {conv.language}
                    </span>
                    <span className="flex items-center gap-1">
                      <MessageSquare className="w-3 h-3" />
                      {conv.messageCount}
                    </span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(conv.startedAt)}
                    </span>
                    <Badge variant={status.variant} className="text-xs">
                      {status.label}
                    </Badge>
                  </div>

                  {/* Link */}
                  <Link
                    href={`/conversations/${conv.id}`}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1.5 rounded-lg hover:bg-muted"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-muted-foreground" />
                  </Link>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
