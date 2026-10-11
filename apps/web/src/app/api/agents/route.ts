import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { z } from "zod";

const createAgentSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.enum([
    "dental_receptionist",
    "restaurant_ordering",
    "social_media_marketing",
    "customer_support",
    "sales_agent",
    "appointment_booking",
    "personal_assistant",
  ]),
  description: z.string().optional(),
  personality: z.string().optional(),
  instructions: z.string().optional(),
  language: z.enum(["en", "ar", "ur", "fr", "auto"]).default("auto"),
  voiceProvider: z
    .enum(["elevenlabs", "azure", "google", "openai"])
    .optional(),
  llmModel: z.string().default("gpt-4o"),
  orgId: z.string().optional(),
});

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orgId = searchParams.get("orgId");

    const agents = await prisma.agent.findMany({
      where: orgId ? { orgId } : undefined,
      orderBy: { createdAt: "desc" },
      include: {
        _count: {
          select: { conversations: true },
        },
      },
    });

    return NextResponse.json(agents);
  } catch (error) {
    console.error("Error fetching agents:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = createAgentSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: "Invalid input", details: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { orgId, ...data } = parsed.data;

    // Use provided orgId or find a default
    let resolvedOrgId = orgId;
    if (!resolvedOrgId) {
      const org = await prisma.organization.findFirst({
        orderBy: { createdAt: "asc" },
      });
      if (!org) {
        return NextResponse.json(
          { error: "No organization found. Please create one first." },
          { status: 400 }
        );
      }
      resolvedOrgId = org.id;
    }

    const agent = await prisma.agent.create({
      data: {
        ...data,
        orgId: resolvedOrgId,
        status: "draft",
      },
    });

    return NextResponse.json(agent, { status: 201 });
  } catch (error) {
    console.error("Error creating agent:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
