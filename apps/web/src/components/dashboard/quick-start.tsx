import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Zap, Plus, BookOpen, MessageSquare, BarChart3 } from "lucide-react";
import Link from "next/link";

const quickActions = [
  {
    icon: Plus,
    label: "Create new agent",
    href: "/agents/new",
    color: "text-violet-600",
    bg: "bg-violet-100 dark:bg-violet-900/30",
  },
  {
    icon: BookOpen,
    label: "Upload knowledge base",
    href: "/knowledge",
    color: "text-blue-600",
    bg: "bg-blue-100 dark:bg-blue-900/30",
  },
  {
    icon: MessageSquare,
    label: "View conversations",
    href: "/conversations",
    color: "text-emerald-600",
    bg: "bg-emerald-100 dark:bg-emerald-900/30",
  },
  {
    icon: BarChart3,
    label: "Check analytics",
    href: "/analytics",
    color: "text-orange-600",
    bg: "bg-orange-100 dark:bg-orange-900/30",
  },
];

export function QuickStartCard() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold flex items-center gap-2">
          <Zap className="w-4 h-4 text-violet-500" />
          Quick Actions
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0 grid grid-cols-2 gap-2">
        {quickActions.map((action) => (
          <Link
            key={action.label}
            href={action.href}
            className="flex flex-col items-center gap-2 p-3 rounded-xl border border-border/60 hover:border-violet-300 hover:shadow-sm transition-all group text-center"
          >
            <div className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center group-hover:scale-110 transition-transform`}>
              <action.icon className={`w-4 h-4 ${action.color}`} />
            </div>
            <span className="text-xs font-medium text-muted-foreground group-hover:text-foreground transition-colors leading-tight">
              {action.label}
            </span>
          </Link>
        ))}
      </CardContent>
    </Card>
  );
}
