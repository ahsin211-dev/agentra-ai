# Agentra AI

**AI Voice + Agent Platform** — Build, deploy, and manage intelligent AI agents for any business in minutes.

Agentra is a commercial SaaS platform that lets businesses create role-based AI agents capable of holding full voice and text conversations with customers — in multiple languages, around the clock, across any channel.

---

## What Does Agentra Do?

Agentra solves a fundamental business problem: **most companies cannot afford to provide 24/7, multilingual, instant customer interaction at scale**. Human staff are expensive, fatigued, and unavailable outside business hours. Generic chatbots are frustrating and off-brand.

Agentra sits in the middle: business-specific AI agents that behave exactly like a trained, knowledgeable employee — one that never sleeps, speaks four languages, handles hundreds of simultaneous conversations, and costs a fraction of human equivalents.

### Who Is It For?

| Business Type | Use Case | Agent Role |
|---------------|----------|------------|
| Dental clinics | 24/7 appointment booking, patient intake, treatment Q&A | Dental Receptionist AI |
| Restaurants | Order taking, menu queries, delivery coordination | Restaurant Ordering AI |
| Marketing agencies | Content creation, campaign drafting, hashtag generation | Social Media Marketing AI |
| SaaS companies | Customer support, issue resolution, ticket creation | Customer Support AI |
| B2B sales teams | Lead qualification, product demos, proposal generation | Sales Agent AI |
| Any business | Meeting scheduling, calendar management | Appointment Booking AI |
| Professionals | Task management, research, drafting | Personal Assistant AI |

---

## Core Capabilities

### Voice AI
Customers can speak naturally. The platform captures audio via the browser (WebRTC), converts it to text using OpenAI Whisper, processes it through the AI brain, generates a text response, and synthesizes it back to natural-sounding speech using ElevenLabs or OpenAI TTS — all within 1–2 seconds.

### Multi-Language Intelligence
Agents detect the customer's language automatically and respond in kind. Arabic and Urdu are supported with full right-to-left (RTL) rendering in the UI. Supported languages: English, Arabic, Urdu, French.

### Role-Based AI Brains
Every agent is configured with a role-specific system prompt, personality, task list, and knowledge schema. A Dental Receptionist AI knows about treatment types, booking workflows, and patient intake — not restaurant menus.

### Knowledge Base
Businesses upload PDFs, documents, URLs, or FAQ data. The platform ingests and embeds this content, making it available to the agent during conversations so answers are grounded in the company's actual policies, menus, prices, or procedures.

### Real-Time Streaming
Responses stream token-by-token via Server-Sent Events. Users see text appear as it generates — eliminating the perceived wait time that degrades experience in traditional chatbots.

### Conversation Memory
Within a session, the agent tracks the full conversation history, maintaining context across multiple turns. (Cross-session memory and CRM sync are available in the enterprise tier.)

### Analytics & Observability
Every conversation, message, token count, and response latency is recorded. The dashboard surfaces weekly conversation volume, average response time, customer satisfaction scores, and language distribution.

---

## Agent Roles

Each role ships with pre-configured system prompts, tools, and knowledge schemas. Deploying takes under five minutes.

### 🦷 Dental Receptionist AI
Handles the full patient interaction lifecycle:
- Answer questions about dental treatments and procedures
- Collect patient information for registration
- Book, reschedule, and cancel appointments
- Explain costs and insurance options in plain language
- Send appointment reminders
- Escalate urgent cases to human staff

### 🍽️ Restaurant Ordering AI
Manages the full ordering flow:
- Welcome customers and present the menu
- Handle dietary requirements and allergen queries
- Take and confirm orders with quantity validation
- Collect delivery address and contact information
- Calculate and display the bill
- Notify the kitchen system of confirmed orders
- Handle modifications and cancellations

### 📱 Social Media Marketing AI
Automates content production:
- Generate platform-specific posts (Facebook, Instagram, LinkedIn, TikTok)
- Write ad copy and campaign briefs
- Produce relevant, trending hashtag sets
- Adapt tone to match the brand voice profile
- Build content calendars
- Suggest campaign strategies based on business goals

### 🎧 Customer Support AI
Resolves customer issues without human escalation in most cases:
- Search the knowledge base for relevant answers
- Create and update support tickets
- Collect bug reports or feedback
- Provide step-by-step guidance through common issues
- Escalate to human agents with full context when necessary

### 💼 Sales Agent AI
Guides prospects through the pipeline:
- Qualify leads by understanding pain points and budget
- Explain products and services with clear value propositions
- Handle objections using proven sales techniques
- Generate and send proposals
- Schedule demos and follow-up calls
- Log prospect data to CRM

### 📅 Appointment Booking AI
Manages scheduling end-to-end:
- Check availability in real time
- Confirm preferences (date, time, format)
- Collect contact and booking information
- Send confirmation messages
- Handle rescheduling and cancellations
- Issue reminders ahead of the appointment

### 🤖 Personal Assistant AI
General-purpose intelligent assistant:
- Answer questions on any topic using up-to-date knowledge
- Draft emails, documents, or messages
- Set and track reminders and tasks
- Search for information and synthesize results
- Help with decisions and recommendations

---

## Tech Stack

| Layer | Technology | Purpose |
|-------|-----------|---------|
| Frontend | Next.js 16, React 19, TypeScript | Web application and API routes |
| Styling | Tailwind CSS v4, Radix UI primitives | UI components and design system |
| Animation | Framer Motion | Micro-interactions |
| Charts | Recharts | Analytics visualizations |
| AI Backend | FastAPI (Python 3.12) | AI/Voice processing engine |
| LLM | OpenAI GPT-4o / GPT-4o Mini | Conversation intelligence |
| Speech-to-Text | OpenAI Whisper | Audio transcription |
| Text-to-Speech | ElevenLabs, OpenAI TTS, Azure, Google | Voice synthesis |
| Database | PostgreSQL 16 + Prisma 7 ORM | Primary data store |
| Cache | Redis 7 | Sessions, rate limiting, streaming |
| Auth | NextAuth.js v5 (JWT + Google OAuth) | Authentication and sessions |
| Storage | AWS S3 | Document and audio file storage |
| Deployment | Docker + Docker Compose | Local and production deployment |
| Infrastructure | Kubernetes-ready | Cloud-scale horizontal scaling |

---

## Project Structure

```
agentra-ai/
│
├── apps/
│   │
│   ├── web/                          # Next.js 16 application
│   │   ├── src/
│   │   │   ├── app/
│   │   │   │   ├── (auth)/           # Public auth pages
│   │   │   │   │   ├── sign-in/      # Login page
│   │   │   │   │   └── sign-up/      # Registration page
│   │   │   │   ├── (dashboard)/      # Protected app pages
│   │   │   │   │   ├── layout.tsx    # Dashboard shell + sidebar
│   │   │   │   │   ├── dashboard/    # Home overview page
│   │   │   │   │   ├── agents/       # Agent list + detail + builder
│   │   │   │   │   ├── conversations/# Conversation history
│   │   │   │   │   ├── analytics/    # Charts and metrics
│   │   │   │   │   ├── knowledge/    # Document upload and management
│   │   │   │   │   └── settings/     # Account, billing, API keys
│   │   │   │   ├── api/              # Next.js API routes (REST)
│   │   │   │   │   ├── auth/         # Register, login
│   │   │   │   │   ├── agents/       # Agent CRUD
│   │   │   │   │   └── chat/         # Streaming AI chat (SSE)
│   │   │   │   └── page.tsx          # Landing page
│   │   │   │
│   │   │   ├── components/
│   │   │   │   ├── ui/               # Base UI primitives (Button, Card, etc.)
│   │   │   │   ├── layout/           # Sidebar, header
│   │   │   │   ├── landing/          # Hero, features, pricing, nav
│   │   │   │   ├── agents/           # Role selector, config form, agent list
│   │   │   │   ├── chat/             # Streaming chat interface
│   │   │   │   ├── conversations/    # Conversation list
│   │   │   │   ├── analytics/        # Stats cards, charts
│   │   │   │   ├── knowledge/        # Upload UI
│   │   │   │   └── dashboard/        # Quick start card
│   │   │   │
│   │   │   ├── lib/
│   │   │   │   ├── ai/               # Agent engine, system prompt builder
│   │   │   │   ├── auth/             # NextAuth config
│   │   │   │   ├── db/               # Prisma client (pg adapter)
│   │   │   │   └── utils/            # cn(), formatDate(), slugify()
│   │   │   │
│   │   │   └── types/                # AgentRole, Language, VoiceProvider enums
│   │   │
│   │   └── prisma/
│   │       └── schema.prisma         # Full database schema (15+ models)
│   │
│   └── api/                          # FastAPI Python backend
│       ├── main.py                   # App factory, CORS, router registration
│       ├── routers/
│       │   ├── chat.py               # Streaming AI chat endpoint
│       │   ├── voice.py              # STT and TTS endpoints
│       │   ├── language.py           # Language detection endpoint
│       │   └── health.py             # Health check
│       └── services/
│           ├── llm_service.py        # OpenAI streaming wrapper
│           ├── stt_service.py        # Whisper transcription
│           ├── tts_service.py        # Multi-provider voice synthesis
│           └── language_service.py   # langdetect wrapper
│
├── docker-compose.yml                # Full-stack local development
├── ARCHITECTURE.md                   # Deep technical architecture doc
└── README.md                         # This file
```

---

## Getting Started

### Prerequisites

- Node.js 22+
- Python 3.12+
- PostgreSQL 16 running locally **or** use Docker
- An [OpenAI API key](https://platform.openai.com/api-keys)

### Option 1 — Docker (Recommended)

Starts the database, cache, frontend, and AI backend together:

```bash
git clone https://github.com/ahsin211-dev/agentra-ai
cd agentra-ai

# Copy and edit environment variables
cp apps/web/.env.example apps/web/.env
# → Set OPENAI_API_KEY in apps/web/.env

docker-compose up -d
```

Open [http://localhost:3000](http://localhost:3000).

### Option 2 — Local Development

```bash
# 1. Start only the infrastructure via Docker
docker-compose up postgres redis -d

# 2. Set up the Next.js frontend
cd apps/web
cp .env.example .env
# Edit .env — at minimum set DATABASE_URL, NEXTAUTH_SECRET, OPENAI_API_KEY

npm install
npx prisma migrate dev --name init
npm run dev
# → http://localhost:3000

# 3. Start the FastAPI AI backend (separate terminal)
cd apps/api
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
# → http://localhost:8000/docs
```

### Environment Variables

```env
# ── Required ──────────────────────────────────────────────────────
DATABASE_URL=postgresql://agentra:agentra_secret@localhost:5432/agentra_ai
NEXTAUTH_SECRET=replace-with-a-random-32-character-string
OPENAI_API_KEY=sk-...

# ── Authentication ────────────────────────────────────────────────
NEXTAUTH_URL=http://localhost:3000
GOOGLE_CLIENT_ID=          # optional — for Google OAuth
GOOGLE_CLIENT_SECRET=      # optional

# ── Voice Providers ───────────────────────────────────────────────
ELEVENLABS_API_KEY=        # optional — for ElevenLabs TTS
AZURE_SPEECH_KEY=          # optional — for Azure Voice
AZURE_SPEECH_REGION=       # optional

# ── File Storage ──────────────────────────────────────────────────
AWS_ACCESS_KEY_ID=         # optional — for S3 document storage
AWS_SECRET_ACCESS_KEY=     # optional
AWS_S3_BUCKET=             # optional
AWS_REGION=                # optional
```

---

## API Reference

### Authentication

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Create account + organization |
| `POST` | `/api/auth/login` | Authenticate and receive session |

### Agents

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/agents` | List all agents for an organization |
| `POST` | `/api/agents` | Create a new agent |
| `GET` | `/api/agents/:id` | Get agent with knowledge base |
| `PATCH` | `/api/agents/:id` | Update agent configuration |
| `DELETE` | `/api/agents/:id` | Delete agent and all data |

### Chat (Streaming)

```
POST /api/chat
Content-Type: application/json

{
  "agentId": "clx...",
  "message": "I'd like to book an appointment",
  "conversationId": null,       // omit to start a new conversation
  "history": []                 // previous message pairs
}

→ Response: text/event-stream
data: {"conversationId": "clx..."}
data: {"delta": "Of"}
data: {"delta": " course"}
data: {"delta": "!"}
data: {"done": true}
```

### Voice AI (FastAPI — port 8000)

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/ai/voice/stt` | Transcribe audio file (multipart) |
| `POST` | `/ai/voice/tts` | Synthesize speech from text |
| `POST` | `/ai/language/detect` | Detect language + RTL flag |
| `POST` | `/ai/chat` | Streaming AI chat (SSE) |
| `GET` | `/health` | Service health check |
| `GET` | `/docs` | Interactive API documentation |

---

## Development Phases

| Phase | Status | What Gets Built |
|-------|--------|-----------------|
| 1 | ✅ Complete | Project setup, auth, landing page, dashboard, agent builder, streaming chat |
| 2 | 🔄 Next | Voice AI — WebRTC audio capture, real-time STT→LLM→TTS pipeline |
| 3 | 📋 Planned | Dental AI module — patient records, appointment calendar, doctor scheduling |
| 4 | 📋 Planned | Restaurant AI module — POS integration, kitchen printing, delivery tracking |
| 5 | 📋 Planned | Marketing AI — brand voice training, content calendar, social publishing |
| 6 | 📋 Planned | Enterprise — SSO/SAML, Stripe billing, audit logs, SLA dashboard |

---

## License

MIT — free for commercial use.
