import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { MessageSquare } from "lucide-react";

const conversations = [
  {
    id: "1",
    agent: "Dental AI",
    emoji: "🦷",
    customer: "Ahmed Al-Rashidi",
    message: "I'd like to book an appointment for tomorrow...",
    time: "2m ago",
    language: "EN",
    status: "active",
  },
  {
    id: "2",
    agent: "Restaurant AI",
    emoji: "🍽️",
    customer: "Fatima Hassan",
    message: "Can I order a large pepperoni pizza?",
    time: "8m ago",
    language: "AR",
    status: "completed",
  },
  {
    id: "3",
    agent: "Support AI",
    emoji: "🎧",
    customer: "James Wilson",
    message: "My account seems to be locked...",
    time: "15m ago",
    language: "EN",
    status: "completed",
  },
  {
    id: "4",
    agent: "Sales AI",
    emoji: "💼",
    customer: "Marie Dupont",
    message: "Je voudrais en savoir plus sur vos offres...",
    time: "22m ago",
    language: "FR",
    status: "completed",
  },
];

export function RecentConversations() {
  return (
    <Card className="border-border/60">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-violet-500" />
            Recent Conversations
          </CardTitle>
          <a href="/conversations" className="text-xs text-violet-600 hover:underline font-medium">
            View all
          </a>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="divide-y divide-border/40">
          {conversations.map((conv) => (
            <div
              key={conv.id}
              className="px-6 py-3 hover:bg-muted/40 transition-colors cursor-pointer"
            >
              <div className="flex items-start gap-3">
                <div className="text-lg flex-shrink-0 mt-0.5">{conv.emoji}</div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <span className="text-sm font-medium text-foreground truncate">
                      {conv.customer}
                    </span>
                    <span className="text-xs px-1.5 py-0.5 rounded bg-muted text-muted-foreground font-mono flex-shrink-0">
                      {conv.language}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground truncate">
                    {conv.message}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 flex-shrink-0">
                  <span className="text-xs text-muted-foreground">{conv.time}</span>
                  <div
                    className={`w-1.5 h-1.5 rounded-full ${
                      conv.status === "active" ? "bg-emerald-500" : "bg-gray-300"
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
