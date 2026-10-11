"use client";

import { useState } from "react";
import { AGENT_ROLES, type AgentRole } from "@/types";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Link from "next/link";

const roleKeys = Object.keys(AGENT_ROLES) as AgentRole[];

export function AgentRolesSection() {
  const [selected, setSelected] = useState<AgentRole>("dental_receptionist");
  const role = AGENT_ROLES[selected];

  return (
    <section id="agents" className="py-32 px-4 sm:px-6 lg:px-8 bg-gray-50/50 dark:bg-gray-900/20">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            Agent marketplace
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Select your{" "}
            <span className="gradient-text">AI agent role</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Pre-built, industry-specific AI agents ready to deploy. Each role comes with
            tailored system prompts, tools, and knowledge schemas.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
          {/* Role cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-3">
            {roleKeys.map((roleKey) => {
              const r = AGENT_ROLES[roleKey];
              const isSelected = selected === roleKey;
              return (
                <button
                  key={roleKey}
                  onClick={() => setSelected(roleKey)}
                  className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                    isSelected
                      ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 shadow-lg shadow-violet-500/10"
                      : "border-border/60 bg-card hover:border-violet-300 hover:shadow-sm"
                  }`}
                >
                  <div className="text-3xl mb-2">{r.icon}</div>
                  <div className="font-medium text-sm text-foreground leading-tight">
                    {r.label}
                  </div>
                  <div className="text-xs text-muted-foreground mt-0.5">{r.industry}</div>
                </button>
              );
            })}
          </div>

          {/* Role detail */}
          <div className="bg-card rounded-2xl border border-border/60 overflow-hidden shadow-sm">
            {/* Header */}
            <div className={`bg-gradient-to-r ${role.gradient} p-6`}>
              <div className="text-5xl mb-3">{role.icon}</div>
              <h3 className="text-xl font-bold text-white">{role.label}</h3>
              <p className="text-white/80 text-sm mt-1">{role.description}</p>
              <div className="flex items-center gap-2 mt-3">
                <span className="px-2 py-0.5 rounded-full bg-white/20 text-white text-xs font-medium">
                  {role.industry}
                </span>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-4">
              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Personality
                </div>
                <p className="text-sm text-foreground leading-relaxed">
                  {role.defaultPersonality}
                </p>
              </div>

              <div>
                <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                  Core instructions
                </div>
                <div className="bg-muted/50 rounded-lg p-3 text-sm font-mono text-muted-foreground text-xs leading-relaxed max-h-32 overflow-y-auto whitespace-pre-wrap">
                  {role.defaultInstructions}
                </div>
              </div>

              <Button variant="gradient" className="w-full" asChild>
                <Link href={`/sign-up?role=${selected}`}>
                  Deploy this agent
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
