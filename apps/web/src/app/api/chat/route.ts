import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { generateStreamingResponse, type Message } from "@/lib/ai/agent-engine";
import { type AgentRole } from "@/types";

export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  try {
    const { agentId, conversationId, message, history = [] } = await req.json();

    if (!agentId || !message) {
      return NextResponse.json(
        { error: "agentId and message are required" },
        { status: 400 }
      );
    }

    // Fetch agent
    const agent = await prisma.agent.findUnique({
      where: { id: agentId },
    });

    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    // Build conversation context
    const messages: Message[] = [
      ...history.slice(-20),
      { role: "user" as const, content: message },
    ];

    const agentContext = {
      id: agent.id,
      name: agent.name,
      role: agent.role as AgentRole,
      personality: agent.personality || "",
      instructions: agent.instructions || "",
      language: agent.language,
    };

    // Save user message
    let convId = conversationId;
    if (!convId) {
      const conv = await prisma.conversation.create({
        data: {
          agentId,
          channel: "web",
          status: "active",
          language: agent.language,
        },
      });
      convId = conv.id;
    }

    await prisma.message.create({
      data: {
        conversationId: convId,
        role: "user",
        content: message,
      },
    });

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = "";

    const stream = new ReadableStream({
      async start(controller) {
        try {
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({ conversationId: convId })}\n\n`
            )
          );

          for await (const chunk of generateStreamingResponse(
            agentContext,
            messages,
            agent.llmModel
          )) {
            fullResponse += chunk;
            controller.enqueue(
              encoder.encode(`data: ${JSON.stringify({ delta: chunk })}\n\n`)
            );
          }

          // Save assistant message
          await prisma.message.create({
            data: {
              conversationId: convId,
              role: "assistant",
              content: fullResponse,
            },
          });

          // Update agent stats
          await prisma.agent.update({
            where: { id: agentId },
            data: {
              totalMessages: { increment: 2 },
            },
          });

          controller.enqueue(
            encoder.encode(`data: ${JSON.stringify({ done: true })}\n\n`)
          );
          controller.close();
        } catch (err) {
          controller.error(err);
        }
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
      },
    });
  } catch (error) {
    console.error("Chat error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
