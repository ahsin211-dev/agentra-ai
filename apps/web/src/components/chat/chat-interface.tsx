"use client";

import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AGENT_ROLES, type AgentRole } from "@/types";
import { Send, Bot, User, Loader2, MessageSquare, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
  timestamp: Date;
}

interface ChatInterfaceProps {
  agent: {
    id: string;
    name: string;
    role: AgentRole;
    language: string;
  };
}

export function ChatInterface({ agent }: ChatInterfaceProps) {
  const roleConfig = AGENT_ROLES[agent.role];
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "welcome",
      role: "assistant",
      content: getWelcomeMessage(agent.role, agent.name),
      timestamp: new Date(),
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      timestamp: new Date(),
    };

    const history = messages
      .filter((m) => m.id !== "welcome")
      .map((m) => ({ role: m.role, content: m.content }));

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setLoading(true);

    const assistantId = (Date.now() + 1).toString();
    const assistantMessage: Message = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, assistantMessage]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentId: agent.id,
          conversationId,
          message: input.trim(),
          history,
        }),
      });

      if (!res.ok) {
        throw new Error("Failed to send message");
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();

      if (!reader) throw new Error("No stream");

      let buffer = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (line.startsWith("data: ")) {
            try {
              const data = JSON.parse(line.slice(6));
              if (data.conversationId && !conversationId) {
                setConversationId(data.conversationId);
              }
              if (data.delta) {
                setMessages((prev) =>
                  prev.map((m) =>
                    m.id === assistantId
                      ? { ...m, content: m.content + data.delta }
                      : m
                  )
                );
              }
            } catch {
              // Skip malformed JSON
            }
          }
        }
      }
    } catch (error) {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === assistantId
            ? {
                ...m,
                content:
                  "Sorry, I encountered an error. Please check your OpenAI API key configuration and try again.",
              }
            : m
        )
      );
    } finally {
      setLoading(false);
      inputRef.current?.focus();
    }
  };

  const handleReset = () => {
    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: getWelcomeMessage(agent.role, agent.name),
        timestamp: new Date(),
      },
    ]);
    setConversationId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <Card className="border-border/60 overflow-hidden">
      <CardHeader className="pb-3 border-b border-border/40">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`w-10 h-10 rounded-xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-xl`}
            >
              {roleConfig.icon}
            </div>
            <div>
              <CardTitle className="text-base">{agent.name}</CardTitle>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-muted-foreground">Online — Testing mode</span>
              </div>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={handleReset}>
            <RotateCcw className="w-3.5 h-3.5" />
            Reset
          </Button>
        </div>
      </CardHeader>

      {/* Messages */}
      <CardContent className="p-0">
        <div className="h-96 overflow-y-auto p-4 space-y-4 bg-gray-50/30 dark:bg-gray-900/20">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={cn(
                "flex gap-3 max-w-[85%]",
                msg.role === "user" ? "ml-auto flex-row-reverse" : ""
              )}
            >
              {/* Avatar */}
              <div
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 text-sm",
                  msg.role === "assistant"
                    ? `bg-gradient-to-br ${roleConfig.gradient} text-white`
                    : "bg-violet-100 dark:bg-violet-900/30 text-violet-600"
                )}
              >
                {msg.role === "assistant" ? (
                  <span className="text-base">{roleConfig.icon}</span>
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>

              {/* Bubble */}
              <div
                className={cn(
                  "rounded-2xl px-4 py-3 text-sm leading-relaxed shadow-sm",
                  msg.role === "assistant"
                    ? "bg-white dark:bg-gray-800 text-foreground border border-border/40"
                    : "bg-gradient-to-br from-violet-600 to-indigo-600 text-white"
                )}
              >
                {msg.content || (
                  <div className="flex gap-1 items-center h-4">
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-100" />
                    <div className="w-2 h-2 rounded-full bg-current animate-bounce delay-200" />
                  </div>
                )}
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-border/40 bg-background">
          <div className="flex gap-2">
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={`Message ${agent.name}...`}
              disabled={loading}
              className="flex-1"
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || loading}
              variant="gradient"
              size="icon"
              className="flex-shrink-0"
            >
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Send className="w-4 h-4" />
              )}
            </Button>
          </div>
          <p className="text-xs text-muted-foreground mt-2 text-center">
            This is a test environment. Conversations are saved but not production traffic.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getWelcomeMessage(role: AgentRole, name: string): string {
  const messages: Record<AgentRole, string> = {
    dental_receptionist: `Hello! I'm ${name}, your AI dental assistant. I can help you schedule appointments, answer questions about dental treatments, or assist with patient registration. How can I help you today? 😊`,
    restaurant_ordering: `Welcome! I'm ${name}, your personal restaurant assistant. I'm here to take your order, help you explore our menu, and ensure you have a great dining experience. What would you like to order today? 🍽️`,
    social_media_marketing: `Hi there! I'm ${name}, your AI marketing specialist. I can help create engaging social media content, develop marketing campaigns, and grow your brand's online presence. What would you like to create today? 📱`,
    customer_support: `Hello! I'm ${name}, here to help resolve your questions and concerns. I'm ready to assist with any issues you may have. What can I help you with today? 🎧`,
    sales_agent: `Hi! I'm ${name}, your dedicated sales consultant. I'm here to understand your needs and help you find the perfect solution. Tell me, what challenges are you looking to solve? 💼`,
    appointment_booking: `Hello! I'm ${name}, your scheduling assistant. I can help you book, reschedule, or manage your appointments quickly and easily. What would you like to schedule? 📅`,
    personal_assistant: `Hi! I'm ${name}, your AI personal assistant. I'm here to help you with tasks, answer questions, and make your day more productive. What do you need help with today? 🤖`,
  };
  return messages[role] || `Hello! I'm ${name}. How can I help you today?`;
}
