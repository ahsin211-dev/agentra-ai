"use client";

import { AGENT_ROLES, type AgentRole } from "@/types";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check } from "lucide-react";
import { useState } from "react";

interface AgentRoleSelectorProps {
  onSelect: (role: AgentRole) => void;
}

const roleKeys = Object.keys(AGENT_ROLES) as AgentRole[];

export function AgentRoleSelector({ onSelect }: AgentRoleSelectorProps) {
  const [hovered, setHovered] = useState<AgentRole | null>(null);
  const highlighted = hovered || "dental_receptionist";
  const role = AGENT_ROLES[highlighted];

  return (
    <div className="max-w-5xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl font-bold mb-2">Choose Your Agent Role</h2>
        <p className="text-muted-foreground">
          Each role comes with pre-built prompts, tools, and industry-specific knowledge.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Role cards */}
        <div className="lg:col-span-3 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 gap-3">
          {roleKeys.map((roleKey) => {
            const r = AGENT_ROLES[roleKey];
            const isHighlighted = highlighted === roleKey;
            return (
              <button
                key={roleKey}
                onMouseEnter={() => setHovered(roleKey)}
                onMouseLeave={() => setHovered(null)}
                onClick={() => onSelect(roleKey)}
                className={`group relative p-5 rounded-2xl border text-left transition-all duration-200 hover:shadow-lg ${
                  isHighlighted
                    ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10"
                    : "border-border/60 bg-card hover:border-violet-300"
                }`}
              >
                {/* Background gradient on hover */}
                <div
                  className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${r.gradient} opacity-0 group-hover:opacity-5 transition-opacity`}
                />

                <div className="relative">
                  <div className="text-3xl mb-3">{r.icon}</div>
                  <div className="font-semibold text-sm text-foreground">{r.label}</div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.industry}</div>

                  {isHighlighted && (
                    <div className="absolute top-0 right-0 w-5 h-5 rounded-full bg-violet-500 flex items-center justify-center">
                      <Check className="w-3 h-3 text-white" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>

        {/* Role details panel */}
        <div className="lg:col-span-2">
          <div
            className={`rounded-2xl overflow-hidden border border-border/60 shadow-sm sticky top-6 transition-all duration-300`}
          >
            {/* Header */}
            <div className={`bg-gradient-to-br ${role.gradient} p-6`}>
              <div className="text-5xl mb-3">{role.icon}</div>
              <h3 className="text-xl font-bold text-white">{role.label}</h3>
              <p className="text-white/80 text-sm mt-1 leading-relaxed">
                {role.description}
              </p>
              <span className="inline-block mt-3 px-2.5 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                {role.industry}
              </span>
            </div>

            <div className="bg-card p-5 space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Default Personality
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {role.defaultPersonality}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Key Capabilities
                </div>
                <div className="bg-muted/50 rounded-xl p-3 text-xs text-muted-foreground font-mono leading-relaxed max-h-28 overflow-y-auto whitespace-pre-wrap">
                  {role.defaultInstructions.slice(0, 300)}...
                </div>
              </div>

              <Button
                variant="gradient"
                className="w-full"
                onClick={() => onSelect(highlighted)}
              >
                Select {role.label}
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
