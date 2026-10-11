"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Play, Sparkles, Zap, Globe2, Mic } from "lucide-react";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
      {/* Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-violet-50 via-white to-indigo-50 dark:from-gray-950 dark:via-gray-900 dark:to-indigo-950/20" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-violet-400/20 blur-3xl animate-pulse" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-indigo-400/20 blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-400/10 blur-3xl" />
      </div>

      {/* Grid pattern */}
      <div className="absolute inset-0 -z-10 opacity-[0.03]">
        <svg width="100%" height="100%">
          <defs>
            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-100 dark:bg-violet-900/30 border border-violet-200 dark:border-violet-700/50 text-violet-700 dark:text-violet-300 text-sm font-medium mb-8">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Powered by GPT-4o + ElevenLabs Voice AI</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6 leading-[1.1]">
          Build AI Agents That
          <br />
          <span className="gradient-text">Think, Speak & Act</span>
        </h1>

        <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed">
          Deploy intelligent voice and chat AI agents for your business in minutes.
          Dental receptionists, restaurant ordering, customer support — all powered by advanced AI.
        </p>

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <Button variant="gradient" size="xl" asChild className="shadow-2xl shadow-violet-500/25">
            <Link href="/sign-up">
              Start building for free
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
          <Button variant="outline" size="xl" className="gap-2">
            <Play className="w-4 h-4 fill-current" />
            Watch demo
          </Button>
        </div>

        {/* Stats */}
        <div className="flex flex-wrap gap-8 justify-center mb-16 text-sm">
          {[
            { value: "7+", label: "Agent roles" },
            { value: "4", label: "Languages" },
            { value: "3", label: "Voice providers" },
            { value: "∞", label: "Conversations" },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-2xl font-bold gradient-text">{stat.value}</div>
              <div className="text-muted-foreground">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature pills */}
        <div className="flex flex-wrap gap-3 justify-center">
          {[
            { icon: Mic, label: "Voice AI" },
            { icon: Globe2, label: "Multi-language" },
            { icon: Zap, label: "Real-time streaming" },
            { icon: Sparkles, label: "GPT-4o powered" },
          ].map((feat) => (
            <div
              key={feat.label}
              className="flex items-center gap-2 px-4 py-2 rounded-full bg-white dark:bg-gray-800 border border-border/60 shadow-sm text-sm font-medium"
            >
              <feat.icon className="w-4 h-4 text-violet-500" />
              {feat.label}
            </div>
          ))}
        </div>

        {/* Dashboard preview */}
        <div className="mt-20 relative">
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent z-10 h-40 bottom-0 top-auto" />
          <div className="relative rounded-2xl border border-border/60 bg-white dark:bg-gray-900 shadow-2xl shadow-violet-500/10 overflow-hidden mx-auto max-w-5xl">
            <div className="bg-gray-50 dark:bg-gray-800 border-b border-border/60 px-4 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
              </div>
              <div className="flex-1 mx-4">
                <div className="bg-white dark:bg-gray-700 rounded-md px-3 py-1 text-xs text-muted-foreground border border-border/40 text-center max-w-xs mx-auto">
                  app.agentra.ai/dashboard
                </div>
              </div>
            </div>
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}

function DashboardPreview() {
  return (
    <div className="flex h-80 bg-gray-50 dark:bg-gray-900/50">
      {/* Sidebar */}
      <div className="w-56 bg-white dark:bg-gray-800/50 border-r border-border/40 p-4 flex flex-col gap-2">
        <div className="flex items-center gap-2 mb-4">
          <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-indigo-600" />
          <div className="h-3 w-16 bg-gray-200 dark:bg-gray-600 rounded shimmer" />
        </div>
        {["Dashboard", "My Agents", "Conversations", "Analytics", "Settings"].map((item, i) => (
          <div
            key={item}
            className={`flex items-center gap-2 px-3 py-2 rounded-lg text-xs ${
              i === 0 ? "bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 font-medium" : "text-gray-500"
            }`}
          >
            <div className={`w-3 h-3 rounded ${i === 0 ? "bg-violet-500" : "bg-gray-300 dark:bg-gray-600"}`} />
            {item}
          </div>
        ))}
      </div>

      {/* Main content */}
      <div className="flex-1 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="h-4 w-32 bg-gray-300 dark:bg-gray-600 rounded mb-2 shimmer" />
            <div className="h-3 w-48 bg-gray-200 dark:bg-gray-700 rounded shimmer" />
          </div>
          <div className="h-8 w-28 bg-gradient-to-r from-violet-600 to-indigo-600 rounded-lg" />
        </div>

        {/* Stats cards */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          {[
            { color: "from-violet-500 to-indigo-500", value: "2,847" },
            { color: "from-emerald-500 to-teal-500", value: "98.2%" },
            { color: "from-orange-500 to-red-500", value: "1.2s" },
          ].map((card, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 rounded-xl border border-border/40 p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-6 h-6 rounded-md bg-gradient-to-br ${card.color}`} />
                <div className="h-2.5 w-20 bg-gray-200 dark:bg-gray-600 rounded shimmer" />
              </div>
              <div className="text-lg font-bold text-foreground">{card.value}</div>
            </div>
          ))}
        </div>

        {/* Agent cards */}
        <div className="grid grid-cols-2 gap-3">
          {[
            { emoji: "🦷", name: "Dental AI", status: "active", color: "bg-blue-100" },
            { emoji: "🍽️", name: "Restaurant AI", status: "active", color: "bg-orange-100" },
          ].map((agent) => (
            <div key={agent.name} className="bg-white dark:bg-gray-800 rounded-xl border border-border/40 p-4 flex items-center gap-3">
              <div className={`w-10 h-10 rounded-xl ${agent.color} dark:bg-opacity-20 flex items-center justify-center text-xl`}>
                {agent.emoji}
              </div>
              <div>
                <div className="text-sm font-medium text-foreground">{agent.name}</div>
                <div className="flex items-center gap-1.5 mt-0.5">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-xs text-muted-foreground capitalize">{agent.status}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
