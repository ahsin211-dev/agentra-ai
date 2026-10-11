import {
  MessageSquare,
  Bot,
  Clock,
  TrendingUp,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

const stats = [
  {
    title: "Total Conversations",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: MessageSquare,
    gradient: "from-violet-500 to-indigo-500",
    description: "vs last month",
  },
  {
    title: "Active Agents",
    value: "5",
    change: "+2",
    trend: "up",
    icon: Bot,
    gradient: "from-blue-500 to-cyan-500",
    description: "this week",
  },
  {
    title: "Avg Response Time",
    value: "1.2s",
    change: "-0.3s",
    trend: "up",
    icon: Clock,
    gradient: "from-emerald-500 to-teal-500",
    description: "vs last week",
  },
  {
    title: "Satisfaction Score",
    value: "98.2%",
    change: "+1.4%",
    trend: "up",
    icon: TrendingUp,
    gradient: "from-orange-500 to-red-500",
    description: "customer rating",
  },
];

export function StatsCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <Card key={stat.title} className="border-border/60 hover:shadow-md transition-shadow duration-200">
          <CardContent className="p-5">
            <div className="flex items-center justify-between mb-4">
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-sm`}
              >
                <stat.icon className="w-5 h-5 text-white" />
              </div>
              <div
                className={`flex items-center gap-1 text-xs font-medium px-2 py-0.5 rounded-full ${
                  stat.trend === "up"
                    ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400"
                    : "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                }`}
              >
                {stat.trend === "up" ? (
                  <ArrowUpRight className="w-3 h-3" />
                ) : (
                  <ArrowDownRight className="w-3 h-3" />
                )}
                {stat.change}
              </div>
            </div>
            <div className="text-2xl font-bold text-foreground mb-0.5">
              {stat.value}
            </div>
            <div className="text-sm text-muted-foreground">{stat.title}</div>
            <div className="text-xs text-muted-foreground/60 mt-0.5">
              {stat.description}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
