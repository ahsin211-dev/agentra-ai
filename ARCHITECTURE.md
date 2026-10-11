# Agentra AI — Architectural Design

This document describes the technical architecture of the Agentra AI platform: what every system does, why it was built that way, and how the components interact at runtime.

---

## Table of Contents

1. [Platform Overview](#1-platform-overview)
2. [System Architecture](#2-system-architecture)
3. [Data Flow Diagrams](#3-data-flow-diagrams)
4. [Frontend Architecture](#4-frontend-architecture)
5. [Backend Architecture](#5-backend-architecture)
6. [AI Engine Design](#6-ai-engine-design)
7. [Voice AI Pipeline](#7-voice-ai-pipeline)
8. [Database Design](#8-database-design)
9. [Multi-Tenancy Model](#9-multi-tenancy-model)
10. [Authentication & Security](#10-authentication--security)
11. [Agent Role System](#11-agent-role-system)
12. [Multi-Language Architecture](#12-multi-language-architecture)
13. [Streaming Architecture](#13-streaming-architecture)
14. [Deployment Architecture](#14-deployment-architecture)
15. [Development Phases](#15-development-phases)

---

## 1. Platform Overview

### What We Build

Agentra AI is a **multi-tenant SaaS platform** that lets businesses deploy AI-powered conversational agents. The platform manages the entire lifecycle of an AI agent:

```
Create → Configure → Train → Deploy → Monitor → Improve
```

Each agent has:
- An **identity** (name, avatar, role, personality)
- A **brain** (LLM model + system prompt + instructions)
- A **voice** (STT + TTS providers and voice settings)
- A **language** (one of EN/AR/UR/FR, or auto-detect)
- A **knowledge base** (uploaded documents, FAQs, URLs)
- A **memory** (conversation history within a session)

### Core Design Principles

**1. Role-first architecture** — Every technical decision is shaped by agent roles. A Dental Receptionist AI and a Restaurant Ordering AI share the same runtime but differ completely in system prompt, tools, database schema, and UI components. The role is the primary abstraction.

**2. Streaming everywhere** — Latency is the #1 enemy of conversational AI. Every AI response streams token-by-token from the LLM through the API to the browser. Voice synthesis is pipelined to begin before the full LLM response arrives.

**3. Multi-tenant isolation** — Every piece of data belongs to an organization. Agents, conversations, knowledge bases, and analytics are scoped by `org_id`. A user's data is invisible to another organization.

**4. Provider abstraction** — The AI backend abstracts over multiple providers (OpenAI, ElevenLabs, Azure, Google). Swapping a voice provider for one agent does not affect others.

**5. Production-first** — The schema, API design, and infrastructure were built for production from day one — not retrofitted after a prototype.

---

## 2. System Architecture

### High-Level View

```
┌─────────────────────────────────────────────────────────────────────────┐
│                             USER'S BROWSER                               │
│                                                                          │
│   ┌─────────────────────────────────────────────────────────────────┐   │
│   │                    Next.js 16 Application                        │   │
│   │  Landing Page │ Dashboard │ Agent Builder │ Chat │ Voice UI     │   │
│   └────────────────────────┬──────────────────────────────┬─────────┘   │
│                            │ HTTPS REST / SSE             │ WebRTC       │
└────────────────────────────┼──────────────────────────────┼─────────────┘
                             │                              │
        ┌────────────────────▼────────────────┐   ┌────────▼───────────────┐
        │       Next.js API Routes            │   │   FastAPI AI Backend   │
        │       (Node.js runtime)             │   │   (Python 3.12)        │
        │                                     │   │                        │
        │  /api/auth/register                 │   │  /ai/voice/stt         │
        │  /api/auth/login                    │   │  /ai/voice/tts         │
        │  /api/agents          (CRUD)        │   │  /ai/chat              │
        │  /api/chat            (SSE stream)  │   │  /ai/language/detect   │
        │  /api/conversations                 │   │                        │
        └───────────────┬─────────────────────┘   └──────────┬─────────────┘
                        │                                     │
        ┌───────────────▼──────────────┐           ┌──────────▼──────────────┐
        │        Prisma 7 ORM          │           │    OpenAI API           │
        │  (pg adapter → PostgreSQL)   │           │    ElevenLabs API       │
        └───────────────┬──────────────┘           │    Azure Speech         │
                        │                          │    Google TTS           │
        ┌───────────────▼──────────────┐           └─────────────────────────┘
        │    PostgreSQL 16             │
        │    (primary data store)      │
        └──────────────────────────────┘
                        │
        ┌───────────────▼──────────────┐
        │    Redis 7                   │
        │    (cache, rate limiting)    │
        └──────────────────────────────┘
```

### Why Two Backends?

The platform uses **two distinct backend runtimes**:

| | Next.js API Routes | FastAPI (Python) |
|-|-------------------|-----------------|
| **Runtime** | Node.js | Python 3.12 |
| **Handles** | Business logic, auth, CRUD, streaming chat | AI processing, voice STT/TTS, language detection |
| **Why** | Collocated with frontend, Prisma ORM support | Python AI/ML ecosystem (Whisper, langdetect, audio processing) |
| **Port** | 3000 | 8000 |

The streaming AI chat endpoint in Next.js (`/api/chat`) calls OpenAI directly using the `openai` Node.js SDK. This avoids an extra network hop for the most latency-sensitive operation. The FastAPI backend handles audio processing and more compute-intensive AI tasks.

---

## 3. Data Flow Diagrams

### Text Chat Flow

```
User types message
        │
        ▼
Browser sends POST /api/chat
        │
        ├─→ Fetch agent from PostgreSQL (role, instructions, llmModel)
        │
        ├─→ Build system prompt (role + personality + language rules)
        │
        ├─→ Append conversation history (last 20 messages)
        │
        ├─→ Call OpenAI GPT-4o with stream: true
        │
        ├─→ Open SSE stream to browser
        │
        └─→ For each token chunk received from OpenAI:
                │
                ├─→ Yield { delta: "chunk" } to SSE stream
                │
                └─→ Browser appends delta to message bubble (live typing)
        │
        ▼
Full response assembled
        │
        ├─→ Save user message to PostgreSQL (messages table)
        ├─→ Save assistant message to PostgreSQL
        └─→ Increment agent.totalMessages counter
```

### Agent Creation Flow

```
User selects role → fills config form → clicks "Deploy"
        │
        ▼
POST /api/agents
{
  name, role, personality, instructions,
  language, voiceProvider, llmModel, orgId
}
        │
        ▼
Zod schema validation
        │
        ├─→ [invalid] → 400 with field errors
        │
        ▼
Prisma creates agent row (status: 'draft')
        │
        ▼
201 response with agent.id
        │
        ▼
Browser redirects to /agents/:id
        │
        ▼
Agent detail page loads → chat interface ready
```

### Voice Call Flow (Phase 2)

```
User clicks "Start Voice Call"
        │
        ▼
Browser requests microphone permission
        │
        ▼
WebRTC audio capture begins
        │
        ▼
Audio chunks stream over WebSocket → FastAPI /ai/voice/stt
        │
        ▼
Whisper transcribes each audio segment
        │
        ▼
Transcript sent to LLM (same system prompt as text chat)
        │
        ▼
LLM generates response text
        │
        ▼
Text sent to TTS provider (ElevenLabs / OpenAI)
        │
        ▼
Audio stream returned to browser
        │
        ▼
Browser plays audio response
```

---

## 4. Frontend Architecture

### Application Structure (App Router)

The Next.js application uses the **App Router** with two route groups:

```
app/
├── (auth)/           # Unauthenticated routes — no sidebar
│   ├── sign-in/      # Rendered statically (no DB calls at build time)
│   └── sign-up/      # Uses Suspense to isolate useSearchParams()
│
├── (dashboard)/      # Authenticated routes — shares sidebar layout
│   ├── layout.tsx    # Renders Sidebar + <main> wrapper
│   ├── dashboard/    # dynamic = "force-dynamic" (always SSR)
│   ├── agents/
│   │   ├── page.tsx          # Agent list
│   │   ├── new/page.tsx      # Agent builder (role select + config)
│   │   └── [id]/page.tsx     # Agent detail + chat test
│   ├── conversations/
│   ├── analytics/
│   ├── knowledge/
│   └── settings/
│
├── api/              # Next.js API routes (Node.js runtime)
│   ├── auth/
│   ├── agents/
│   └── chat/
│
└── page.tsx          # Public landing page (statically rendered)
```

### Route Rendering Strategy

| Route | Strategy | Reason |
|-------|----------|--------|
| `/` | Static | No dynamic data; SEO-critical |
| `/sign-in`, `/sign-up` | Static | Pure client forms |
| `/dashboard` and all app pages | `force-dynamic` | Data changes per user/request |
| `/api/*` | Dynamic (SSR) | Server-side data access |

### Component Hierarchy

```
Layout (sidebar + main)
│
├── Sidebar
│   ├── Logo
│   ├── PlanBadge
│   ├── NavLinks (with active state)
│   └── UserProfile
│
├── DashboardHeader (title + action button)
│
└── Page Content
    ├── StatsCards (4 metric tiles)
    ├── AgentsList (with status badges and pagination)
    ├── QuickStartCard (grid of action shortcuts)
    └── RecentConversations (last 4 with language indicators)
```

### State Management

The application uses **local component state** (React `useState`) for UI interactions and **server fetches** for data. There is no global state manager (no Redux, no Zustand) in Phase 1.

- **Form state**: Managed with `useState` inside each form component
- **Server data**: Fetched directly in components via `fetch()` + `useEffect`
- **Streaming**: Managed by reading `ReadableStream` chunks in the chat component
- **Auth state**: Managed by NextAuth.js session cookies + JWT

### Design System

All UI components are built on **Radix UI primitives** with custom styling applied via Tailwind CSS. No third-party component library is used — this gives full control over appearance.

Key design tokens (defined in CSS variables):
- `--primary`: Violet-600 (brand color)
- `--radius`: 0.75rem (rounded corners)
- `gradient-text`: `from-violet-600 to-indigo-600`

---

## 5. Backend Architecture

### Next.js API Routes

API routes run in the **Node.js runtime** (not Edge). This is required because:
1. Prisma ORM uses native PostgreSQL binary protocol
2. The `@prisma/adapter-pg` driver requires a Node.js `pg.Pool`
3. `bcryptjs` requires Node.js crypto

Each route follows the same pattern:

```typescript
export async function POST(req: NextRequest) {
  // 1. Parse and validate input with Zod
  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) return 400 error;

  // 2. Perform business logic
  const result = await prisma.model.create({ data: parsed.data });

  // 3. Return response
  return NextResponse.json(result, { status: 201 });
}
```

### FastAPI Backend

The Python backend is a **pure AI processing service**. It does not access the database directly — it receives all necessary context from the caller and returns results.

```
apps/api/
├── main.py               # FastAPI app + CORS + router registration
├── routers/
│   ├── chat.py           # POST /ai/chat — streaming SSE
│   ├── voice.py          # POST /ai/voice/stt + /ai/voice/tts
│   ├── language.py       # POST /ai/language/detect
│   └── health.py         # GET /health
└── services/
    ├── llm_service.py    # AsyncOpenAI streaming wrapper
    ├── stt_service.py    # Whisper via OpenAI API
    ├── tts_service.py    # OpenAI TTS + ElevenLabs HTTP client
    └── language_service.py  # langdetect + RTL detection
```

All service classes are **stateless** — they hold only API client instances and have no per-request state. This makes them trivially scalable horizontally.

---

## 6. AI Engine Design

### System Prompt Construction

The AI engine (`src/lib/ai/agent-engine.ts`) builds system prompts dynamically at conversation time. The prompt is assembled from:

```
[Role context]         — what this agent's job is
[Personality]          — tone, communication style
[Core instructions]    — specific tasks the agent performs
[Language rules]       — how to handle multilingual input
[Behavioral guardrails]— what the agent must never do
```

Example assembled system prompt for a Dental Receptionist:

```
You are Dr. Smile Receptionist, an AI dental receptionist assistant.

## Role Context
Dental Receptionist — Schedule appointments, answer dental questions, collect patient info

## Personality
Professional, warm, empathetic, and knowledgeable about dental care. You speak in
a reassuring tone to help patients feel comfortable.

## Core Instructions
1. Answer dental questions and provide general dental health information
2. Schedule and manage patient appointments
3. Collect patient information for registration
...

## Language Behavior
Detect the user's language automatically and respond in the same language.
Support English, Arabic (RTL), Urdu, and French natively.

## Key Rules
- Stay fully in character as Dr. Smile Receptionist
- Never provide specific medical diagnoses
- For urgent cases, always recommend calling the clinic directly
```

### LLM Call Architecture

```typescript
// Non-streaming (synchronous responses)
async function generateResponse(agent, messages, model): Promise<string>

// Streaming (real-time token delivery)
async function* generateStreamingResponse(agent, messages, model): AsyncGenerator<string>
```

The streaming generator yields individual token chunks. The API route reads these chunks and forwards them over SSE to the browser.

### Conversation History Management

Each API call to `/api/chat` receives the last N messages from the client. The server:
1. Appends the new user message
2. Prepends the system prompt
3. Calls the LLM with the full context window
4. Persists both the user message and the assistant response to PostgreSQL

History is capped at 20 messages per API call to control token costs. Full conversation history is always available in the database for analytics.

---

## 7. Voice AI Pipeline

### Architecture

```
                    ┌──────────────────────────────────────────┐
                    │              BROWSER                      │
                    │                                          │
                    │  [Mic] → MediaRecorder → audio/webm      │
                    └──────────────────┬───────────────────────┘
                                       │ HTTP multipart POST
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │         FastAPI  /ai/voice/stt           │
                    │                                          │
                    │  1. Receive audio bytes                  │
                    │  2. Create BytesIO buffer                │
                    │  3. Call openai.audio.transcriptions     │
                    │     model="whisper-1"                    │
                    │     response_format="verbose_json"       │
                    │  4. Return { transcript, language }      │
                    └──────────────────┬───────────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │        Next.js  /api/chat                │
                    │                                          │
                    │  1. Receive transcript as user message   │
                    │  2. Build system prompt for agent        │
                    │  3. Stream response from GPT-4o         │
                    │  4. Collect full response text           │
                    └──────────────────┬───────────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │         FastAPI  /ai/voice/tts           │
                    │                                          │
                    │  Provider routing:                       │
                    │  ┌──────────────────────────────────┐   │
                    │  │ if provider == "openai":          │   │
                    │  │   openai.audio.speech.create()    │   │
                    │  │   model="tts-1", voice="nova"     │   │
                    │  │                                   │   │
                    │  │ elif provider == "elevenlabs":    │   │
                    │  │   POST api.elevenlabs.io          │   │
                    │  │   model="eleven_multilingual_v2"  │   │
                    │  └──────────────────────────────────┘   │
                    │                                          │
                    │  Returns: audio/mpeg bytes               │
                    └──────────────────┬───────────────────────┘
                                       │
                                       ▼
                    ┌──────────────────────────────────────────┐
                    │              BROWSER                      │
                    │  new Audio(url).play()                   │
                    └──────────────────────────────────────────┘
```

### STT Provider: OpenAI Whisper

Whisper is the primary STT provider because:
- Handles all four target languages natively (EN, AR, UR, FR)
- Returns the detected language alongside the transcript
- Achieves low word-error rates on accented speech
- API-based (no local GPU required)

### TTS Providers

| Provider | Voice Quality | Latency | Multilingual | Use Case |
|----------|--------------|---------|-------------|----------|
| ElevenLabs | Best (hyper-realistic) | ~500ms | Yes | Customer-facing premium voices |
| OpenAI TTS | Excellent | ~200ms | Yes | Default, fast, reliable |
| Azure Cognitive | Very good | ~300ms | 400+ voices | Enterprise, custom neural voices |
| Google Cloud | Good | ~250ms | 40+ languages | High-volume, cost-effective |

The TTS service selects the provider based on the agent's `voiceProvider` setting. If a provider's API key is not configured, it falls back to OpenAI TTS.

---

## 8. Database Design

### Entity Relationship Overview

```
Organization (1) ──── (*) OrgMember ──── (*) User
     │
     ├──── (*) Agent
     │          │
     │          ├──── (*) KnowledgeBase
     │          ├──── (*) Conversation
     │          │          │
     │          │          ├──── (*) Message
     │          │          └──── (*) Order (restaurant)
     │          └──── (*) AnalyticsEvent
     │
     ├──── (*) ApiKey
     └──── (*) AnalyticsEvent
```

### Key Design Decisions

**CUID over UUID for primary keys** — CUIDs are shorter, URL-safe, sortable by time, and collision-resistant without a database sequence. They also eliminate the need for a `serial` type in PostgreSQL.

**JSONB for flexible settings** — Agent `settings`, conversation `metadata`, and order `items` use JSONB rather than rigid columns. This allows per-role extensions without schema migrations.

**Enum types in Prisma** — Agent role, status, language, and voice provider are all Prisma enums. This provides type safety in TypeScript and maps to PostgreSQL native enum types.

**Soft relationships across modules** — Dental patients and restaurant orders are separate tables linked by `orgId`, not by `agentId`. This means a clinic can have multiple agents that all share patient data.

### Core Tables

```sql
-- Multi-tenant root
organizations (id, name, slug, owner_id, plan, settings)
users         (id, email, name, password_hash, role, plan)
org_members   (id, org_id, user_id, role)

-- Agent configuration
agents        (id, org_id, name, role, personality, instructions,
               language, voice_provider, llm_model, status, settings)

-- Knowledge and learning
knowledge_bases (id, agent_id, name, type, content, file_url, embedding_status)

-- Conversation tracking
conversations (id, agent_id, channel, status, language, customer_*)
messages      (id, conversation_id, role, content, tokens_used, latency_ms)

-- Industry modules
dental_patients      (id, org_id, name, email, phone, medical_history)
dental_appointments  (id, patient_id, treatment, scheduled_at, status)
restaurants          (id, org_id, name, settings)
menu_items           (id, restaurant_id, name, price, category, available)
orders               (id, conversation_id, items, total, status)

-- Observability
analytics_events (id, org_id, agent_id, event_type, properties)
api_keys         (id, org_id, name, key_hash, last_used_at)
```

### Prisma 7 Configuration

Prisma 7 changed how database connections are specified. The `url` property is removed from `schema.prisma`. Instead, the connection is configured in `prisma7.config.ts` and passed to the `PrismaClient` constructor via a driver adapter:

```typescript
// lib/db/index.ts
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const adapter = new PrismaPg(pool);
export const prisma = new PrismaClient({ adapter });
```

This architecture allows connection pooling at the `pg.Pool` level and supports PgBouncer in transaction mode for production.

---

## 9. Multi-Tenancy Model

### Organization Scoping

Every data record in the platform belongs to an organization. There is no global namespace. The isolation is enforced at the Prisma query level — every query includes `where: { orgId }`.

```typescript
// Example: always scope agent queries to the caller's org
await prisma.agent.findMany({
  where: { orgId: session.user.orgId }
});
```

### User Roles Within an Organization

| Role | Permissions |
|------|-------------|
| `owner` | Full access, billing, delete organization |
| `admin` | Create/edit agents, manage members |
| `member` | View agents and conversations, no config changes |

### Platform Roles (Cross-Organization)

| Role | Permissions |
|------|-------------|
| `admin` | Super-admin access to all organizations (support) |
| `enterprise` | Enterprise tier with SLA features |
| `user` | Standard user within their organization |

---

## 10. Authentication & Security

### Authentication Flow

```
User submits sign-in form
        │
        ▼
POST /api/auth/login
        │
        ├─→ Find user by email in PostgreSQL
        ├─→ bcrypt.compare(plaintext, hash) — constant-time comparison
        │
        ├─→ [invalid] → 401 "Invalid email or password"
        │
        ▼
Return user object to client
        │
        ▼
NextAuth.js creates JWT session cookie (httpOnly, Secure, SameSite=Lax)
        │
        ▼
JWT payload: { id, email, role, orgId }
        │
        ▼
Dashboard pages read session from cookie on every request
```

### Password Security

- Passwords are hashed with **bcrypt** at cost factor 12 before storage
- Plain-text passwords are never logged or stored
- Password comparison uses bcrypt's constant-time algorithm (prevents timing attacks)

### API Security

| Mechanism | Implementation |
|-----------|---------------|
| Input validation | Zod schema on every API route |
| SQL injection | Prisma ORM parameterizes all queries |
| XSS | React escapes all rendered content |
| CSRF | NextAuth.js handles CSRF tokens on mutation routes |
| CORS | FastAPI CORS middleware with explicit origin whitelist |
| Rate limiting | Redis-backed counter per IP (planned) |
| API keys | SHA-256 hashed before storage; never returned after creation |

### Secret Management

- All secrets are environment variables — never hardcoded
- The `.env` file is gitignored
- Client-side code cannot access `OPENAI_API_KEY` or other server secrets
- The `NEXT_PUBLIC_` prefix convention is used strictly (no sensitive data has this prefix)

---

## 11. Agent Role System

### How Roles Work

A role is a compile-time constant defined in `src/types/index.ts`. Each role specifies:

```typescript
{
  label: string,         // Display name
  description: string,   // What the agent does
  icon: string,          // Emoji icon
  gradient: string,      // Tailwind gradient for UI
  industry: string,      // Industry vertical
  defaultPersonality: string,   // Starter personality text
  defaultInstructions: string,  // Starter system instructions
}
```

At agent creation time, the user customizes these defaults. At conversation time, the instructions and personality are assembled into the system prompt.

### Role → Feature Mapping

| Role | Extra DB Tables | Special API Endpoints | UI Modules |
|------|----------------|----------------------|------------|
| `dental_receptionist` | `dental_patients`, `dental_appointments` | `/api/appointments` | Patient intake form |
| `restaurant_ordering` | `restaurants`, `menu_items`, `orders` | `/api/orders` | Menu browser, order tracker |
| `social_media_marketing` | — | `/api/content/generate` | Content calendar |
| `customer_support` | — | `/api/tickets` | Ticket queue |
| `sales_agent` | — | `/api/proposals` | Pipeline view |
| `appointment_booking` | — | `/api/calendar` | Calendar picker |
| `personal_assistant` | — | — | — |

### Extending the Role System

To add a new role:
1. Add the role key to the `AgentRole` type union in `src/types/index.ts`
2. Add the role configuration object to the `AGENT_ROLES` constant
3. Add the enum value to the Prisma schema and run a migration
4. Implement any role-specific API routes and database tables
5. The UI (role selector, agent builder) picks it up automatically

---

## 12. Multi-Language Architecture

### Supported Languages

| Code | Language | Script | Direction | Notes |
|------|----------|--------|-----------|-------|
| `en` | English | Latin | LTR | Default |
| `ar` | Arabic | Arabic | **RTL** | Full RTL UI rendering |
| `ur` | Urdu | Nastaliq | **RTL** | Shares RTL support with Arabic |
| `fr` | French | Latin | LTR | Full support |
| `auto` | Auto-detect | — | Auto | Whisper returns language on STT |

### Language Detection

For voice input, language is detected automatically by Whisper during transcription. For text input with `language: "auto"`, the system prompt instructs the LLM to:

```
Detect the user's language automatically and respond in the same language.
```

For explicit languages, the prompt instructs:

```
Always respond in French. If the user writes in a different language,
still respond in French.
```

### RTL Support

Arabic and Urdu require **right-to-left rendering**. The platform handles this at two levels:

1. **CSS**: `[dir="rtl"] { text-align: right; }` in global styles
2. **HTML attribute**: The `dir` attribute is set programmatically based on detected language

The FastAPI language service returns an `is_rtl: boolean` flag alongside every detected language, which the frontend uses to toggle the `dir` attribute on the conversation container.

---

## 13. Streaming Architecture

### Why Streaming Matters

A full GPT-4o response to a complex question takes 3–8 seconds to generate. Without streaming, the user sees a loading spinner for that entire duration. With streaming, they see text appear within 300–500ms and continue appearing word-by-word — the same experience as watching someone type.

### Server-Sent Events (SSE)

The `/api/chat` route returns a `ReadableStream` with `Content-Type: text/event-stream`:

```typescript
// Server (Next.js API route)
const stream = new ReadableStream({
  async start(controller) {
    // Send conversation ID first
    controller.enqueue(`data: ${JSON.stringify({ conversationId })}\n\n`);

    // Stream each token chunk
    for await (const chunk of generateStreamingResponse(agent, messages)) {
      controller.enqueue(`data: ${JSON.stringify({ delta: chunk })}\n\n`);
    }

    controller.enqueue(`data: ${JSON.stringify({ done: true })}\n\n`);
    controller.close();
  }
});

return new Response(stream, {
  headers: { "Content-Type": "text/event-stream" }
});
```

```typescript
// Client (React component)
const reader = res.body.getReader();
const decoder = new TextDecoder();

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // Parse SSE lines and append deltas to message state
  const lines = decoder.decode(value).split("\n");
  for (const line of lines) {
    if (line.startsWith("data: ")) {
      const { delta } = JSON.parse(line.slice(6));
      if (delta) setMessages(prev => appendToLastMessage(prev, delta));
    }
  }
}
```

### Token Buffering

Raw OpenAI streaming delivers tokens in very small chunks (1–3 characters each). The client accumulates these into a running string and re-renders React state on each chunk. React's batching keeps this performant even at ~30 tokens/second.

---

## 14. Deployment Architecture

### Docker Compose (Local / Staging)

```yaml
services:
  postgres:   # PostgreSQL 16 Alpine
  redis:      # Redis 7 Alpine
  api:        # FastAPI — uvicorn, hot-reload in dev
  web:        # Next.js — npm run dev in dev, compiled in prod
```

All services communicate over the `agentra-network` Docker bridge network. External ports:
- `3000` → Next.js
- `8000` → FastAPI
- `5432` → PostgreSQL (dev only)
- `6379` → Redis (dev only)

### Production (Kubernetes)

```
Kubernetes Cluster (e.g., GKE, EKS)
│
├── Namespace: agentra-production
│   ├── Deployment: web          (Next.js, 3 replicas, 512Mi RAM)
│   ├── Deployment: api          (FastAPI, 2 replicas, 1Gi RAM)
│   ├── HorizontalPodAutoscaler  (CPU-based, max 10 replicas each)
│   │
│   ├── ConfigMap: app-config    (non-secret env vars)
│   ├── Secret: api-secrets      (OPENAI_API_KEY, DB passwords)
│   │
│   └── Ingress (NGINX)
│       ├── app.agentra.ai/      → web service
│       └── api.agentra.ai/      → api service
│
└── Managed Services (external)
    ├── Cloud SQL (PostgreSQL)   — HA, automated backups
    ├── Memorystore (Redis)      — HA, persistence
    ├── AWS S3                   — file storage
    └── OpenAI / ElevenLabs API  — AI providers
```

### Build Pipeline

```
git push → GitHub Actions CI
    │
    ├─→ Type check (tsc --noEmit)
    ├─→ Lint (eslint)
    ├─→ Unit tests (jest)
    ├─→ Build (npm run build)
    │
    └─→ [main branch only]
        ├─→ Docker build → push to container registry
        └─→ kubectl rollout restart (zero-downtime rolling update)
```

### Environment Promotion

```
local → staging → production
  │         │          │
 .env   .env.staging  .env.production
         (auto-deploy  (manual approve
          on main)      + smoke tests)
```

---

## 15. Development Phases

### Phase 1 — Foundation (Complete)

**What was built:**
- Monorepo structure (`apps/web` + `apps/api`)
- Prisma 7 schema with 15+ models
- Authentication (email + Google OAuth, NextAuth.js v5)
- Landing page (hero, features, agent roles, pricing)
- Dashboard with sidebar navigation
- Agent Builder: role selector + multi-tab configuration
- Streaming AI chat interface (`/api/chat` → SSE → browser)
- Conversation list with language and channel indicators
- Analytics dashboard with charts
- Knowledge base upload UI
- Settings page with API key management
- FastAPI backend for voice and language
- Docker Compose for full-stack local development

### Phase 2 — Voice AI

**What will be built:**
- WebRTC audio capture in the browser
- Real-time STT → LLM → TTS pipeline
- Voice call UI (waveform animation, mute, end call)
- Interrupt detection (stop TTS when user speaks)
- Voice personality selection (choose from provider voices)

### Phase 3 — Dental AI Module

**What will be built:**
- Patient registration and profile management
- Appointment calendar with doctor availability
- Treatment explanation knowledge base
- Automated appointment reminder calls (outbound voice)
- Patient follow-up workflow

### Phase 4 — Restaurant AI Module

**What will be built:**
- Menu management with categories and images
- Real-time order tracking board
- Kitchen notification system (webhook / WebSocket to POS)
- Delivery address collection and validation
- Payment integration (Stripe)

### Phase 5 — Social Media Marketing AI

**What will be built:**
- Brand voice training from uploaded examples
- Platform-specific content generation (Facebook, Instagram, LinkedIn, TikTok)
- Content calendar with scheduling
- Hashtag research and trend analysis
- Social media API publishing (OAuth per platform)

### Phase 6 — Enterprise Features

**What will be built:**
- SSO / SAML integration
- Stripe billing with plan enforcement
- Audit logs for all actions
- Custom LLM fine-tuning integration
- White-label deployment options
- SLA dashboard and uptime monitoring
- Team management and advanced RBAC
