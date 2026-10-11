"use client";

import { useState } from "react";
import { AGENT_ROLES, type AgentRole, type Language, type VoiceProvider } from "@/types";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, ArrowRight, Bot, Globe2, Mic, Brain, Loader2, Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface AgentConfigFormProps {
  role: AgentRole;
  onBack: () => void;
  onSuccess: (agentId: string) => void;
}

const languages: { value: Language; label: string; flag: string; rtl?: boolean }[] = [
  { value: "en", label: "English", flag: "🇺🇸" },
  { value: "ar", label: "Arabic", flag: "🇸🇦", rtl: true },
  { value: "ur", label: "Urdu", flag: "🇵🇰", rtl: true },
  { value: "fr", label: "French", flag: "🇫🇷" },
  { value: "auto", label: "Auto-detect", flag: "🌍" },
];

const voiceProviders: { value: VoiceProvider; label: string; description: string }[] = [
  { value: "elevenlabs", label: "ElevenLabs", description: "Most natural, ultra-realistic voices" },
  { value: "openai", label: "OpenAI TTS", description: "Fast, reliable voice synthesis" },
  { value: "azure", label: "Azure Voice", description: "Enterprise-grade, 400+ voices" },
  { value: "google", label: "Google TTS", description: "Multilingual, high accuracy" },
];

const llmModels = [
  { value: "gpt-4o", label: "GPT-4o", description: "Best quality, recommended" },
  { value: "gpt-4o-mini", label: "GPT-4o Mini", description: "Faster, cost-efficient" },
  { value: "gpt-4-turbo", label: "GPT-4 Turbo", description: "Powerful, large context" },
];

type Tab = "general" | "voice" | "ai" | "review";

export function AgentConfigForm({ role, onBack, onSuccess }: AgentConfigFormProps) {
  const roleConfig = AGENT_ROLES[role];
  const [activeTab, setActiveTab] = useState<Tab>("general");
  const [loading, setLoading] = useState(false);
  const [created, setCreated] = useState(false);

  const [config, setConfig] = useState({
    name: `${roleConfig.label} Agent`,
    description: roleConfig.description,
    personality: roleConfig.defaultPersonality,
    instructions: roleConfig.defaultInstructions,
    language: "auto" as Language,
    voiceEnabled: true,
    voiceProvider: "elevenlabs" as VoiceProvider,
    llmModel: "gpt-4o",
  });

  const tabs: { id: Tab; label: string; icon: typeof Bot }[] = [
    { id: "general", label: "General", icon: Bot },
    { id: "voice", label: "Voice", icon: Mic },
    { id: "ai", label: "AI Brain", icon: Brain },
    { id: "review", label: "Review", icon: Check },
  ];

  const handleCreate = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/agents", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...config, role }),
      });
      const data = await res.json();
      if (res.ok) {
        setCreated(true);
        setTimeout(() => onSuccess(data.id), 1500);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (created) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <div className="w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center mx-auto mb-4">
          <Check className="w-10 h-10 text-emerald-600" />
        </div>
        <h2 className="text-2xl font-bold mb-2">Agent Created!</h2>
        <p className="text-muted-foreground">Redirecting to your agent dashboard...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="sm" onClick={onBack} className="gap-1.5">
          <ArrowLeft className="w-3.5 h-3.5" />
          Change role
        </Button>

        {/* Agent role badge */}
        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-full bg-gradient-to-r ${roleConfig.gradient} text-white text-sm font-medium`}>
          <span>{roleConfig.icon}</span>
          {roleConfig.label}
        </div>
      </div>

      {/* Tab navigation */}
      <div className="flex gap-1 mb-6 bg-muted/50 p-1 rounded-xl w-fit">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all",
              activeTab === tab.id
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            )}
          >
            <tab.icon className="w-3.5 h-3.5" />
            {tab.label}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Form */}
        <div className="lg:col-span-2">
          {activeTab === "general" && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">General Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-5">
                <div className="space-y-2">
                  <Label>Agent Name</Label>
                  <Input
                    value={config.name}
                    onChange={(e) => setConfig({ ...config, name: e.target.value })}
                    placeholder="e.g. Dr. Smile Receptionist"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Description</Label>
                  <Input
                    value={config.description}
                    onChange={(e) => setConfig({ ...config, description: e.target.value })}
                    placeholder="Brief description of what this agent does"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Personality</Label>
                  <textarea
                    className="w-full min-h-24 px-3 py-2.5 rounded-lg border border-input bg-background text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={config.personality}
                    onChange={(e) => setConfig({ ...config, personality: e.target.value })}
                    placeholder="Describe the agent's personality and tone..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>System Instructions</Label>
                  <textarea
                    className="w-full min-h-40 px-3 py-2.5 rounded-lg border border-input bg-background text-sm font-mono resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    value={config.instructions}
                    onChange={(e) => setConfig({ ...config, instructions: e.target.value })}
                  />
                  <p className="text-xs text-muted-foreground">
                    These are the core instructions that guide your agent's behavior.
                  </p>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "voice" && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Voice & Language</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Language */}
                <div className="space-y-3">
                  <Label>Language</Label>
                  <div className="grid grid-cols-3 gap-2">
                    {languages.map((lang) => (
                      <button
                        key={lang.value}
                        onClick={() => setConfig({ ...config, language: lang.value })}
                        className={cn(
                          "flex items-center gap-2 p-3 rounded-xl border text-sm font-medium transition-all",
                          config.language === lang.value
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20 text-violet-700"
                            : "border-border/60 hover:border-violet-300"
                        )}
                      >
                        <span className="text-base">{lang.flag}</span>
                        <span className="text-xs">{lang.label}</span>
                        {lang.rtl && (
                          <span className="ml-auto text-xs text-muted-foreground">RTL</span>
                        )}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Voice provider */}
                <div className="space-y-3">
                  <Label>Text-to-Speech Provider</Label>
                  <div className="space-y-2">
                    {voiceProviders.map((provider) => (
                      <button
                        key={provider.value}
                        onClick={() => setConfig({ ...config, voiceProvider: provider.value })}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                          config.voiceProvider === provider.value
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20"
                            : "border-border/60 hover:border-violet-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center flex-shrink-0",
                            config.voiceProvider === provider.value
                              ? "border-violet-500"
                              : "border-border"
                          )}
                        >
                          {config.voiceProvider === provider.value && (
                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <div>
                          <div className="font-medium text-sm">{provider.label}</div>
                          <div className="text-xs text-muted-foreground">{provider.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "ai" && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">AI Brain Configuration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-3">
                  <Label>Language Model</Label>
                  <div className="space-y-2">
                    {llmModels.map((model) => (
                      <button
                        key={model.value}
                        onClick={() => setConfig({ ...config, llmModel: model.value })}
                        className={cn(
                          "w-full flex items-center gap-3 p-4 rounded-xl border text-left transition-all",
                          config.llmModel === model.value
                            ? "border-violet-400 bg-violet-50 dark:bg-violet-900/20"
                            : "border-border/60 hover:border-violet-300"
                        )}
                      >
                        <div
                          className={cn(
                            "w-4 h-4 rounded-full border-2 flex items-center justify-center",
                            config.llmModel === model.value
                              ? "border-violet-500"
                              : "border-border"
                          )}
                        >
                          {config.llmModel === model.value && (
                            <div className="w-2 h-2 rounded-full bg-violet-500" />
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-medium text-sm">{model.label}</span>
                            {model.value === "gpt-4o" && (
                              <span className="text-xs px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400">
                                Recommended
                              </span>
                            )}
                          </div>
                          <div className="text-xs text-muted-foreground">{model.description}</div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-4 rounded-xl border border-border/60 bg-muted/30">
                  <div className="flex items-start gap-3">
                    <Brain className="w-5 h-5 text-violet-500 flex-shrink-0 mt-0.5" />
                    <div>
                      <div className="font-medium text-sm mb-1">Memory & Context</div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        Your agent maintains conversation history within each session.
                        Upgrade to Pro for cross-session memory and CRM integration.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {activeTab === "review" && (
            <Card className="border-border/60">
              <CardHeader>
                <CardTitle className="text-base">Review & Deploy</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    { label: "Name", value: config.name },
                    { label: "Role", value: roleConfig.label },
                    { label: "Language", value: config.language === "auto" ? "Auto-detect" : config.language.toUpperCase() },
                    { label: "Voice", value: voiceProviders.find(v => v.value === config.voiceProvider)?.label },
                    { label: "LLM Model", value: config.llmModel },
                    { label: "Industry", value: roleConfig.industry },
                  ].map((item) => (
                    <div key={item.label} className="flex flex-col gap-1">
                      <span className="text-xs font-medium text-muted-foreground">{item.label}</span>
                      <span className="font-medium text-foreground">{item.value}</span>
                    </div>
                  ))}
                </div>

                <div className="border-t border-border/40 pt-4">
                  <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                    Personality preview
                  </div>
                  <p className="text-sm text-muted-foreground italic">&ldquo;{config.personality.slice(0, 120)}...&rdquo;</p>
                </div>

                <Button
                  variant="gradient"
                  size="lg"
                  className="w-full mt-2"
                  onClick={handleCreate}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      Deploying agent...
                    </>
                  ) : (
                    <>
                      Deploy Agent
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Navigation */}
          {activeTab !== "review" && (
            <div className="flex justify-end mt-4">
              <Button
                variant="gradient"
                onClick={() => {
                  const order: Tab[] = ["general", "voice", "ai", "review"];
                  const idx = order.indexOf(activeTab);
                  setActiveTab(order[idx + 1]);
                }}
              >
                Continue
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Preview panel */}
        <div className="lg:col-span-1">
          <div className="sticky top-6 rounded-2xl border border-border/60 overflow-hidden">
            <div className={`bg-gradient-to-br ${roleConfig.gradient} p-5`}>
              <div className="text-4xl mb-2">{roleConfig.icon}</div>
              <div className="text-white font-semibold">{config.name}</div>
              <div className="text-white/70 text-xs mt-1">{roleConfig.label}</div>
            </div>
            <div className="p-5 bg-card space-y-3">
              <div className="text-xs text-muted-foreground font-medium uppercase tracking-wider">
                Configuration
              </div>
              {[
                { label: "Role", value: roleConfig.label },
                { label: "Language", value: config.language === "auto" ? "Auto-detect" : config.language.toUpperCase() },
                { label: "Voice", value: voiceProviders.find(v => v.value === config.voiceProvider)?.label },
                { label: "Model", value: config.llmModel },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">{item.label}</span>
                  <span className="font-medium text-foreground text-xs">{item.value}</span>
                </div>
              ))}

              {/* Progress indicator */}
              <div className="pt-2">
                <div className="text-xs text-muted-foreground mb-1.5">Setup progress</div>
                <div className="flex gap-1">
                  {(["general", "voice", "ai", "review"] as Tab[]).map((t) => (
                    <div
                      key={t}
                      className={cn(
                        "h-1 flex-1 rounded-full transition-all",
                        activeTab === t
                          ? "bg-violet-500"
                          : tabs.findIndex(tab => tab.id === t) < tabs.findIndex(tab => tab.id === activeTab)
                          ? "bg-emerald-500"
                          : "bg-muted"
                      )}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
