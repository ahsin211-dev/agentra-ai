# Agentra AI — System Architecture

## Overview

Agentra AI is a production-ready AI Voice + AI Agent Platform built as a commercial SaaS product. It enables businesses to create, configure, train, and deploy intelligent AI agents for various industry verticals.

---

## 1. System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER                              │
│  Next.js 15 App (React + TypeScript + Tailwind + Shadcn UI)     │
│  ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────────────┐   │
│  │ Landing  │ │Dashboard │ │  Agent   │ │  Voice Call UI   │   │
│  │  Page    │ │  + Nav   │ │ Builder  │ │  (WebRTC/WS)     │   │
│  └──────────┘ └──────────┘ └──────────┘ └──────────────────┘   │
└────────────────────────┬────────────────────────────────────────┘
                         │ HTTPS / WebSocket
┌────────────────────────▼────────────────────────────────────────┐
│                      API GATEWAY LAYER                           │
│  Next.js API Routes (/api/*) + FastAPI (Python /ai/*)           │
│  ┌─────────────┐ ┌───────────────┐ ┌──────────────────────┐    │
│  │ Auth Routes │ │ Agent Routes  │ │ Conversation Routes  │    │
│  │ /api/auth   │ │ /api/agents   │ │ /api/conversations   │    │
│  └─────────────┘ └───────────────┘ └──────────────────────┘    │
└────────────────────────┬────────────────────────────────────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                    ORCHESTRATION LAYER                           │
│                    Agent Orchestrator                            │
│  ┌──────────────────────────────────────────────────────────┐   │
│  │  Role Manager → Memory Engine → Tool Engine → Response   │   │
│  └──────────────────────────────────────────────────────────┘   │
└───┬──────────┬────────────────┬────────────────┬────────────────┘
    │          │                │                │
┌───▼──┐  ┌───▼──┐       ┌─────▼──┐      ┌──────▼───┐
│Voice │  │ LLM  │       │Memory  │      │Knowledge │
│Engine│  │Engine│       │Engine  │      │  Engine  │
│(STT/ │  │(GPT/ │       │(Redis/ │      │(Vector   │
│ TTS) │  │Local)│       │Prisma) │      │  DB)     │
└──────┘  └──────┘       └────────┘      └──────────┘
                         │
┌────────────────────────▼────────────────────────────────────────┐
│                      DATA LAYER                                  │
│  PostgreSQL (primary) │ Redis (cache/sessions) │ S3 (storage)   │
└─────────────────────────────────────────────────────────────────┘
```

---

## 2. Database Schema

### Core Tables

```sql
-- Users & Authentication
users
  id              UUID PRIMARY KEY
  email           VARCHAR UNIQUE NOT NULL
  name            VARCHAR
  avatar_url      VARCHAR
  role            ENUM('admin', 'user', 'enterprise')
  plan            ENUM('free', 'pro', 'enterprise')
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Organizations (multi-tenant)
organizations
  id              UUID PRIMARY KEY
  name            VARCHAR NOT NULL
  slug            VARCHAR UNIQUE
  owner_id        UUID REFERENCES users(id)
  plan            ENUM('free', 'pro', 'enterprise')
  settings        JSONB
  created_at      TIMESTAMP

-- Organization Members
org_members
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  user_id         UUID REFERENCES users(id)
  role            ENUM('owner', 'admin', 'member')
  created_at      TIMESTAMP

-- AI Agents
agents
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  name            VARCHAR NOT NULL
  slug            VARCHAR
  role            ENUM('dental_receptionist','restaurant_ordering','social_media_marketing',
                       'customer_support','sales_agent','appointment_booking','personal_assistant')
  industry        VARCHAR
  description     TEXT
  avatar_url      VARCHAR
  personality     TEXT
  instructions    TEXT
  language        ENUM('en','ar','ur','fr','auto')
  voice_id        VARCHAR
  voice_provider  ENUM('elevenlabs','azure','google','openai')
  llm_model       VARCHAR DEFAULT 'gpt-4o'
  status          ENUM('draft','active','paused','archived')
  settings        JSONB
  created_at      TIMESTAMP
  updated_at      TIMESTAMP

-- Knowledge Bases
knowledge_bases
  id              UUID PRIMARY KEY
  agent_id        UUID REFERENCES agents(id)
  name            VARCHAR NOT NULL
  type            ENUM('document','url','faq','custom')
  content         TEXT
  file_url        VARCHAR
  embedding_status ENUM('pending','processing','completed','failed')
  created_at      TIMESTAMP

-- Conversations
conversations
  id              UUID PRIMARY KEY
  agent_id        UUID REFERENCES agents(id)
  session_id      VARCHAR
  customer_name   VARCHAR
  customer_email  VARCHAR
  customer_phone  VARCHAR
  language        VARCHAR
  channel         ENUM('web','voice','api','whatsapp')
  status          ENUM('active','completed','abandoned')
  metadata        JSONB
  started_at      TIMESTAMP
  ended_at        TIMESTAMP

-- Messages
messages
  id              UUID PRIMARY KEY
  conversation_id UUID REFERENCES conversations(id)
  role            ENUM('user','assistant','system','tool')
  content         TEXT NOT NULL
  audio_url       VARCHAR
  tokens_used     INTEGER
  latency_ms      INTEGER
  created_at      TIMESTAMP

-- Dental Module
dental_patients
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  name            VARCHAR NOT NULL
  email           VARCHAR
  phone           VARCHAR
  date_of_birth   DATE
  medical_history JSONB
  created_at      TIMESTAMP

dental_appointments
  id              UUID PRIMARY KEY
  patient_id      UUID REFERENCES dental_patients(id)
  doctor_id       UUID
  treatment       VARCHAR
  scheduled_at    TIMESTAMP
  status          ENUM('scheduled','confirmed','completed','cancelled')
  notes           TEXT
  created_at      TIMESTAMP

-- Restaurant Module
restaurants
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  name            VARCHAR NOT NULL
  settings        JSONB

menu_items
  id              UUID PRIMARY KEY
  restaurant_id   UUID REFERENCES restaurants(id)
  name            VARCHAR NOT NULL
  description     TEXT
  price           DECIMAL(10,2)
  category        VARCHAR
  image_url       VARCHAR
  available       BOOLEAN DEFAULT true
  created_at      TIMESTAMP

orders
  id              UUID PRIMARY KEY
  restaurant_id   UUID REFERENCES restaurants(id)
  conversation_id UUID REFERENCES conversations(id)
  customer_name   VARCHAR
  items           JSONB
  total           DECIMAL(10,2)
  status          ENUM('pending','confirmed','preparing','ready','delivered','cancelled')
  delivery_address TEXT
  created_at      TIMESTAMP

-- Analytics
analytics_events
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  agent_id        UUID REFERENCES agents(id)
  event_type      VARCHAR
  properties      JSONB
  created_at      TIMESTAMP

-- API Keys
api_keys
  id              UUID PRIMARY KEY
  org_id          UUID REFERENCES organizations(id)
  name            VARCHAR
  key_hash        VARCHAR NOT NULL
  last_used_at    TIMESTAMP
  expires_at      TIMESTAMP
  created_at      TIMESTAMP
```

---

## 3. API Design

### Authentication
- `POST /api/auth/signup` — Register user
- `POST /api/auth/signin` — Sign in (returns JWT)
- `GET  /api/auth/me` — Current user
- `POST /api/auth/signout` — Sign out

### Agents
- `GET    /api/agents` — List agents
- `POST   /api/agents` — Create agent
- `GET    /api/agents/:id` — Get agent
- `PUT    /api/agents/:id` — Update agent
- `DELETE /api/agents/:id` — Delete agent
- `POST   /api/agents/:id/activate` — Activate agent

### Conversations
- `POST /api/conversations` — Start conversation
- `GET  /api/conversations` — List conversations
- `GET  /api/conversations/:id` — Get conversation with messages
- `POST /api/conversations/:id/messages` — Send message
- `POST /api/conversations/:id/end` — End conversation

### AI (FastAPI)
- `POST /ai/chat` — Process chat message
- `POST /ai/voice/stt` — Speech to text
- `POST /ai/voice/tts` — Text to speech
- `POST /ai/language/detect` — Detect language

### Knowledge Base
- `POST /api/knowledge` — Upload document
- `GET  /api/knowledge/:agentId` — List knowledge
- `DELETE /api/knowledge/:id` — Delete document

### Analytics
- `GET /api/analytics/overview` — Dashboard stats
- `GET /api/analytics/conversations` — Conversation metrics
- `GET /api/analytics/agents` — Per-agent metrics

---

## 4. Folder Structure

```
agentra-ai/
├── apps/
│   ├── web/                          # Next.js 15 Frontend
│   │   ├── app/
│   │   │   ├── (auth)/               # Auth pages (sign-in, sign-up)
│   │   │   ├── (dashboard)/          # Protected dashboard
│   │   │   │   ├── dashboard/        # Main dashboard
│   │   │   │   ├── agents/           # Agent management
│   │   │   │   ├── conversations/    # Conversation history
│   │   │   │   ├── analytics/        # Analytics
│   │   │   │   ├── knowledge/        # Knowledge base
│   │   │   │   └── settings/         # Settings
│   │   │   ├── (public)/             # Public pages
│   │   │   │   └── page.tsx          # Landing page
│   │   │   └── api/                  # Next.js API routes
│   │   │       ├── auth/
│   │   │       ├── agents/
│   │   │       ├── conversations/
│   │   │       └── knowledge/
│   │   ├── components/
│   │   │   ├── ui/                   # Shadcn UI components
│   │   │   ├── agents/               # Agent-specific components
│   │   │   ├── chat/                 # Chat interface
│   │   │   ├── voice/                # Voice UI components
│   │   │   ├── analytics/            # Analytics components
│   │   │   └── layout/               # Layout components
│   │   ├── lib/
│   │   │   ├── ai/                   # AI utilities
│   │   │   ├── auth/                 # Auth config
│   │   │   ├── db/                   # Prisma client
│   │   │   └── utils/                # Utilities
│   │   └── prisma/
│   │       └── schema.prisma
│   └── api/                          # FastAPI Python backend
│       ├── main.py
│       ├── routers/
│       │   ├── chat.py
│       │   ├── voice.py
│       │   └── language.py
│       ├── services/
│       │   ├── llm_service.py
│       │   ├── stt_service.py
│       │   ├── tts_service.py
│       │   └── memory_service.py
│       └── requirements.txt
├── packages/
│   └── types/                        # Shared TypeScript types
├── docker-compose.yml
└── ARCHITECTURE.md
```

---

## 5. Voice AI Pipeline

```
User speaks
    │
    ▼
WebRTC audio capture (browser)
    │
    ▼
WebSocket stream → FastAPI
    │
    ▼
Whisper STT (OpenAI / local)
    │
    ▼
Language Detection (langdetect)
    │
    ▼
Agent Orchestrator
    ├── Load agent profile
    ├── Retrieve conversation memory
    ├── Build system prompt (role + personality + instructions)
    └── Call LLM (OpenAI GPT-4o / local)
         │
         ▼
    Response text
         │
         ▼
TTS Engine (ElevenLabs / Azure / Google)
    │
    ▼
Audio stream → WebSocket → Browser playback
```

---

## 6. Agent Role System

Each agent role ships with:

| Role | System Prompt | Tools | Knowledge Schema |
|------|-------------|-------|-----------------|
| Dental Receptionist | Healthcare assistant | appointment_booking, patient_lookup | treatments, doctors, schedules |
| Restaurant Ordering | Food service assistant | menu_lookup, order_create, order_update | menu items, pricing |
| Social Media Marketing | Brand content creator | post_generate, hashtag_suggest | brand voice, campaigns |
| Customer Support | Support specialist | ticket_create, kb_search | FAQs, policies |
| Sales Agent | Sales professional | crm_lookup, proposal_generate | products, pricing |
| Appointment Booking | Scheduling assistant | calendar_check, booking_create | availability |
| Personal Assistant | General assistant | web_search, reminder_set | user preferences |

---

## 7. Security Architecture

- **Authentication**: NextAuth.js with JWT + refresh tokens
- **Authorization**: RBAC (Role-Based Access Control) — org owner, admin, member
- **API Security**: API key hashing (bcrypt), rate limiting (Redis), CORS
- **Data**: Input validation (Zod), SQL injection prevention (Prisma ORM)
- **Secrets**: Environment variables, never exposed client-side
- **Voice**: WebRTC DTLS-SRTP encryption for audio streams

---

## 8. Deployment Architecture

```
Kubernetes Cluster
├── Namespace: agentra-production
│   ├── Deployment: web (Next.js) — 3 replicas
│   ├── Deployment: api (FastAPI) — 2 replicas
│   ├── Service: PostgreSQL (or managed RDS)
│   ├── Service: Redis (or managed ElastiCache)
│   └── Ingress: NGINX with SSL termination
└── External Services
    ├── AWS S3 (file storage)
    ├── OpenAI API
    ├── ElevenLabs API
    └── Pinecone / ChromaDB (vector store)
```

---

## 9. Development Phases

| Phase | Scope | Status |
|-------|-------|--------|
| 1 | Project setup, Auth, Dashboard, Agent Builder | ✅ Building |
| 2 | AI Text Chat Agent | Planned |
| 3 | Voice AI | Planned |
| 4 | Dental AI Module | Planned |
| 5 | Restaurant AI Module | Planned |
| 6 | Social Media Marketing AI | Planned |
| 7 | Enterprise features, billing | Planned |
