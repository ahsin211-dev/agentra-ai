"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { DashboardHeader } from "@/components/layout/header";
import { AgentRoleSelector } from "@/components/agents/role-selector";
import { AgentConfigForm } from "@/components/agents/config-form";
import { type AgentRole } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

type Step = "role" | "config" | "review";

export default function NewAgentPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("role");
  const [selectedRole, setSelectedRole] = useState<AgentRole | null>(null);

  const handleRoleSelect = (role: AgentRole) => {
    setSelectedRole(role);
    setStep("config");
  };

  return (
    <div className="flex flex-col min-h-screen">
      <DashboardHeader
        title="Create New Agent"
        description="Configure and deploy your AI agent"
      />

      <div className="flex-1 p-6">
        {/* Breadcrumb / Steps */}
        <div className="flex items-center gap-2 mb-8">
          <Link href="/agents">
            <Button variant="ghost" size="sm" className="gap-1.5">
              <ArrowLeft className="w-3.5 h-3.5" />
              My Agents
            </Button>
          </Link>
          <div className="flex items-center gap-2 ml-2">
            {[
              { id: "role", label: "1. Choose Role" },
              { id: "config", label: "2. Configure" },
              { id: "review", label: "3. Deploy" },
            ].map((s) => (
              <div key={s.id} className="flex items-center gap-2">
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium transition-all ${
                    step === s.id
                      ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300"
                      : s.id < step
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {s.label}
                </div>
                {s.id !== "review" && (
                  <div className="w-8 h-px bg-border" />
                )}
              </div>
            ))}
          </div>
        </div>

        {step === "role" && (
          <AgentRoleSelector onSelect={handleRoleSelect} />
        )}

        {step === "config" && selectedRole && (
          <AgentConfigForm
            role={selectedRole}
            onBack={() => setStep("role")}
            onSuccess={(agentId) => router.push(`/agents/${agentId}`)}
          />
        )}
      </div>
    </div>
  );
}
