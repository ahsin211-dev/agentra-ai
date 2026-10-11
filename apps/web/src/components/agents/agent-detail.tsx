"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChatInterface } from "@/components/chat/chat-interface";
import { AGENT_ROLES, type AgentRole } from "@/types";
import {
  MessageSquare,
  Settings,
  Play,
  Pause,
  BarChart3,
  BookOpen,
  Globe2,
  Mic,
  Brain,
  Loader2,
} from "lucide-react";

interface Agent {
  id: string;
  name: string;
  role: AgentRole;
  description: string;
  personality: string;
  instructions: string;
  language: string;
  voiceProvider: string;
  llmModel: string;
  status: string;
  totalConversations: number;
  totalMessages: number;
  createdAt: string;
}

interface AgentDetailViewProps {
  agentId: string;
}

export function AgentDetailView({ agentId }: AgentDetailViewProps) {
  const [agent, setAgent] = useState<Agent | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<"chat" | "settings" | "analytics">("chat");

  useEffect(() => {
    fetch(`/api/agents/${agentId}`)
      .then((r) => r.json())
      .then((data) => {
        setAgent(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [agentId]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-violet-500" />
      </div>
    );
  }

  // Use mock data if agent not found (demo mode)
  const displayAgent = agent || {
    id: agentId,
    name: "Demo Dental Agent",
    role: "dental_receptionist" as AgentRole,
    description: "AI dental receptionist",
    personality: "Professional, warm, empathetic",
    instructions: "Help patients with appointments",
    language: "en",
    voiceProvider: "elevenlabs",
    llmModel: "gpt-4o",
    status: "active",
    totalConversations: 1243,
    totalMessages: 8921,
    createdAt: new Date().toISOString(),
  };

  const roleConfig = AGENT_ROLES[displayAgent.role];

  return (
    <div className="max-w-6xl mx-auto space-y-6">
      {/* Agent header */}
      <div className="flex items-start gap-4">
        <div
          className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-3xl shadow-lg`}
        >
          {roleConfig.icon}
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-foreground">{displayAgent.name}</h1>
            <Badge variant={displayAgent.status === "active" ? "success" : "secondary"}>
              <div className={`w-1.5 h-1.5 rounded-full mr-1 ${displayAgent.status === "active" ? "bg-emerald-500" : "bg-gray-400"}`} />
              {displayAgent.status}
            </Badge>
          </div>
          <p className="text-muted-foreground text-sm">{displayAgent.description}</p>
          <div className="flex items-center gap-4 mt-2 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5" />
              {displayAgent.llmModel}
            </span>
            <span className="flex items-center gap-1.5">
              <Globe2 className="w-3.5 h-3.5" />
              {displayAgent.language === "auto" ? "Auto-detect" : displayAgent.language.toUpperCase()}
            </span>
            <span className="flex items-center gap-1.5">
              <Mic className="w-3.5 h-3.5" />
              {displayAgent.voiceProvider}
            </span>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant={displayAgent.status === "active" ? "outline" : "gradient"}
            size="sm"
          >
            {displayAgent.status === "active" ? (
              <>
                <Pause className="w-3.5 h-3.5" />
                Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" />
                Activate
              </>
            )}
          </Button>
          <Button variant="outline" size="sm">
            <Settings className="w-3.5 h-3.5" />
            Configure
          </Button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Conversations", value: displayAgent.totalConversations.toLocaleString(), icon: MessageSquare, color: "from-violet-500 to-indigo-500" },
          { label: "Messages", value: displayAgent.totalMessages.toLocaleString(), icon: BarChart3, color: "from-blue-500 to-cyan-500" },
          { label: "Knowledge Docs", value: "0", icon: BookOpen, color: "from-emerald-500 to-teal-500" },
        ].map((stat) => (
          <Card key={stat.label} className="border-border/60">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-9 h-9 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-4.5 h-4.5 text-white" />
              </div>
              <div>
                <div className="text-xl font-bold text-foreground">{stat.value}</div>
                <div className="text-xs text-muted-foreground">{stat.label}</div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 bg-muted/50 p-1 rounded-xl w-fit">
        {[
          { id: "chat", label: "Test Chat", icon: MessageSquare },
          { id: "analytics", label: "Analytics", icon: BarChart3 },
          { id: "settings", label: "Settings", icon: Settings },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === "chat" && (
        <ChatInterface agent={displayAgent} />
      )}

      {activeTab === "analytics" && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Conversation Analytics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-center h-48 text-muted-foreground text-sm">
              Analytics data will appear after your first conversations.
            </div>
          </CardContent>
        </Card>
      )}

      {activeTab === "settings" && (
        <Card className="border-border/60">
          <CardHeader>
            <CardTitle className="text-base">Agent Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              {[
                { label: "Role", value: roleConfig.label },
                { label: "Industry", value: roleConfig.industry },
                { label: "Language", value: displayAgent.language === "auto" ? "Auto-detect" : displayAgent.language.toUpperCase() },
                { label: "Voice Provider", value: displayAgent.voiceProvider },
                { label: "LLM Model", value: displayAgent.llmModel },
                { label: "Status", value: displayAgent.status },
              ].map((item) => (
                <div key={item.label} className="p-3 rounded-lg bg-muted/40 border border-border/40">
                  <div className="text-xs text-muted-foreground mb-0.5">{item.label}</div>
                  <div className="font-medium capitalize">{item.value}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
