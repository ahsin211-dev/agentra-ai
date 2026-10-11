import OpenAI from "openai";
import { AGENT_ROLES, type AgentRole } from "@/types";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface AgentContext {
  id: string;
  name: string;
  role: AgentRole;
  personality: string;
  instructions: string;
  language: string;
}

export function buildSystemPrompt(agent: AgentContext): string {
  const roleConfig = AGENT_ROLES[agent.role];

  const languageInstructions =
    agent.language === "auto"
      ? "Automatically detect the user's language and respond in the same language. Support English, Arabic, Urdu, and French."
      : `Respond in ${getLanguageName(agent.language)}. If the user writes in a different language, still respond in ${getLanguageName(agent.language)}.`;

  return `You are ${agent.name}, an AI ${roleConfig.label} assistant.

## Your Role
${roleConfig.label} — ${roleConfig.description}

## Your Personality
${agent.personality || roleConfig.defaultPersonality}

## Your Instructions
${agent.instructions || roleConfig.defaultInstructions}

## Language
${languageInstructions}

## Guidelines
- Always stay in character as ${agent.name}
- Be helpful, accurate, and professional
- If you don't know something, say so honestly
- Never provide information outside your role scope
- Keep responses concise but complete
- Use natural, conversational language`;
}

function getLanguageName(code: string): string {
  const map: Record<string, string> = {
    en: "English",
    ar: "Arabic",
    ur: "Urdu",
    fr: "French",
  };
  return map[code] || "English";
}

export async function generateResponse(
  agent: AgentContext,
  messages: Message[],
  model = "gpt-4o"
): Promise<string> {
  const systemPrompt = buildSystemPrompt(agent);

  const response = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.7,
    stream: false,
  });

  return response.choices[0]?.message?.content || "";
}

export async function* generateStreamingResponse(
  agent: AgentContext,
  messages: Message[],
  model = "gpt-4o"
): AsyncGenerator<string> {
  const systemPrompt = buildSystemPrompt(agent);

  const stream = await openai.chat.completions.create({
    model,
    messages: [
      { role: "system", content: systemPrompt },
      ...messages,
    ],
    max_tokens: 1024,
    temperature: 0.7,
    stream: true,
  });

  for await (const chunk of stream) {
    const delta = chunk.choices[0]?.delta?.content;
    if (delta) {
      yield delta;
    }
  }
}
