import {
  Mic,
  Brain,
  Globe2,
  Zap,
  Shield,
  BarChart3,
  MessageSquare,
  Layers,
} from "lucide-react";

const features = [
  {
    icon: Mic,
    title: "Voice AI Conversations",
    description:
      "Natural voice conversations powered by Whisper STT and ElevenLabs TTS. Support for real-time streaming, interrupt handling, and voice personalities.",
    gradient: "from-violet-500 to-purple-600",
  },
  {
    icon: Brain,
    title: "GPT-4o Powered Brain",
    description:
      "Each agent runs on OpenAI's GPT-4o with custom system prompts, conversation memory, and role-specific knowledge bases for accurate responses.",
    gradient: "from-blue-500 to-cyan-600",
  },
  {
    icon: Globe2,
    title: "Multi-language Support",
    description:
      "Native support for English, Arabic, Urdu, and French. Automatic language detection with RTL support for Arabic — agents respond in the customer's language.",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    icon: Zap,
    title: "Real-time Streaming",
    description:
      "WebSocket-based real-time streaming for near-zero latency responses. Interrupt handling and natural pause detection for human-like conversations.",
    gradient: "from-orange-500 to-red-600",
  },
  {
    icon: Layers,
    title: "Role-based Agents",
    description:
      "7+ pre-built agent roles with tailored system prompts, tools, and knowledge schemas. Deploy a dental receptionist or restaurant ordering bot in minutes.",
    gradient: "from-pink-500 to-rose-600",
  },
  {
    icon: MessageSquare,
    title: "Conversation Memory",
    description:
      "Persistent conversation context with Redis-backed memory. Agents remember patient details, past orders, and customer preferences across sessions.",
    gradient: "from-indigo-500 to-violet-600",
  },
  {
    icon: BarChart3,
    title: "Advanced Analytics",
    description:
      "Track conversation volumes, response times, satisfaction scores, language distribution, and token usage across all your deployed agents.",
    gradient: "from-yellow-500 to-orange-600",
  },
  {
    icon: Shield,
    title: "Enterprise Security",
    description:
      "RBAC access control, API key management, end-to-end encrypted voice streams, and full audit logs. SOC2-ready architecture from day one.",
    gradient: "from-slate-500 to-gray-600",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            Platform capabilities
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Everything you need to deploy
            <br />
            <span className="gradient-text">production AI agents</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            From voice AI infrastructure to industry-specific agents — Agentra gives you
            the complete stack to build and scale conversational AI.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {features.map((feature, i) => (
            <div
              key={feature.title}
              className="group relative p-6 rounded-2xl border border-border/60 bg-card hover:border-violet-300 dark:hover:border-violet-700 hover:shadow-lg hover:shadow-violet-500/5 transition-all duration-300"
            >
              <div
                className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}
              >
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
