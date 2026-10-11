"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { StatsCards } from "./stats-cards";

const conversationData = [
  { day: "Mon", conversations: 42, messages: 312 },
  { day: "Tue", conversations: 58, messages: 421 },
  { day: "Wed", conversations: 71, messages: 534 },
  { day: "Thu", conversations: 65, messages: 489 },
  { day: "Fri", conversations: 89, messages: 671 },
  { day: "Sat", conversations: 45, messages: 334 },
  { day: "Sun", conversations: 38, messages: 281 },
];

const agentData = [
  { name: "Dental AI", value: 1243, color: "#6366f1" },
  { name: "Restaurant AI", value: 892, color: "#f59e0b" },
  { name: "Support AI", value: 456, color: "#10b981" },
  { name: "Sales AI", value: 256, color: "#3b82f6" },
];

const languageData = [
  { name: "English", value: 68, color: "#6366f1" },
  { name: "Arabic", value: 15, color: "#f59e0b" },
  { name: "French", value: 12, color: "#10b981" },
  { name: "Urdu", value: 5, color: "#3b82f6" },
];

const responseTimeData = [
  { time: "00:00", avg: 1.4 },
  { time: "04:00", avg: 1.1 },
  { time: "08:00", avg: 1.8 },
  { time: "12:00", avg: 2.1 },
  { time: "16:00", avg: 1.9 },
  { time: "20:00", avg: 1.5 },
];

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <StatsCards />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        {/* Conversations over time */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversations This Week</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <BarChart data={conversationData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="day" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Bar dataKey="conversations" fill="#6366f1" radius={[4, 4, 0, 0]} />
                <Bar dataKey="messages" fill="#a5b4fc" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Response time */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Avg Response Time (seconds)</CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={responseTimeData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="time" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "8px",
                    fontSize: "12px",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="avg"
                  stroke="#6366f1"
                  strokeWidth={2}
                  dot={{ fill: "#6366f1", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Agent distribution */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Conversations by Agent</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={agentData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {agentData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {agentData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 text-sm">{item.name}</div>
                    <div className="font-medium text-sm">{item.value.toLocaleString()}</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Language distribution */}
        <Card className="border-border/60">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Language Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={180} height={180}>
                <PieChart>
                  <Pie
                    data={languageData}
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={80}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {languageData.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="space-y-3 flex-1">
                {languageData.map((item) => (
                  <div key={item.name} className="flex items-center gap-2.5">
                    <div
                      className="w-3 h-3 rounded-full flex-shrink-0"
                      style={{ backgroundColor: item.color }}
                    />
                    <div className="flex-1 text-sm">{item.name}</div>
                    <div className="font-medium text-sm">{item.value}%</div>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
