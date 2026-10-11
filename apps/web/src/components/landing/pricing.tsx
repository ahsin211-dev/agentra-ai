import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import Link from "next/link";

const plans = [
  {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for trying out Agentra AI",
    features: [
      "1 AI agent",
      "100 conversations/month",
      "Text chat only",
      "English language",
      "Basic analytics",
      "Community support",
    ],
    cta: "Start free",
    href: "/sign-up",
    popular: false,
    gradient: "",
  },
  {
    name: "Pro",
    price: "$49",
    period: "per month",
    description: "For growing businesses and teams",
    features: [
      "5 AI agents",
      "2,000 conversations/month",
      "Voice + chat AI",
      "All 4 languages",
      "Advanced analytics",
      "Knowledge base (50MB)",
      "API access",
      "Email support",
    ],
    cta: "Start Pro trial",
    href: "/sign-up?plan=pro",
    popular: true,
    gradient: "from-violet-600 to-indigo-600",
  },
  {
    name: "Enterprise",
    price: "$199",
    period: "per month",
    description: "For large organizations",
    features: [
      "Unlimited agents",
      "Unlimited conversations",
      "Voice + chat + API",
      "All languages + custom",
      "Custom analytics",
      "Knowledge base (10GB)",
      "Priority API access",
      "SLA + dedicated support",
      "Custom integrations",
      "SSO + SAML",
    ],
    cta: "Contact sales",
    href: "/contact",
    popular: false,
    gradient: "",
  },
];

export function PricingSection() {
  return (
    <section id="pricing" className="py-32 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-violet-100 dark:bg-violet-900/30 text-violet-700 dark:text-violet-300 text-sm font-medium mb-4">
            Simple pricing
          </div>
          <h2 className="text-4xl sm:text-5xl font-bold mb-4">
            Start free, scale with{" "}
            <span className="gradient-text">your business</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-xl mx-auto">
            No hidden fees. Cancel anytime. All plans include a 14-day free trial.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-2xl border p-8 ${
                plan.popular
                  ? "border-violet-400 shadow-2xl shadow-violet-500/20"
                  : "border-border/60 shadow-sm"
              } bg-card`}
            >
              {plan.popular && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2">
                  <div className="px-3 py-1 rounded-full bg-gradient-to-r from-violet-600 to-indigo-600 text-white text-xs font-bold">
                    Most popular
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className="font-bold text-xl mb-1">{plan.name}</h3>
                <p className="text-muted-foreground text-sm mb-4">{plan.description}</p>
                <div className="flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-muted-foreground text-sm">/{plan.period}</span>
                </div>
              </div>

              <Button
                variant={plan.popular ? "gradient" : "outline"}
                className="w-full mb-6"
                asChild
              >
                <Link href={plan.href}>{plan.cta}</Link>
              </Button>

              <ul className="space-y-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-center gap-2.5 text-sm">
                    <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 ${plan.popular ? "bg-violet-100 dark:bg-violet-900/40" : "bg-muted"}`}>
                      <Check className={`w-2.5 h-2.5 ${plan.popular ? "text-violet-600 dark:text-violet-400" : "text-muted-foreground"}`} />
                    </div>
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
