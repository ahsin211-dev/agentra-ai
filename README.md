# Agentra AI — AI Voice & Agent Platform

A production-ready **AI Voice + AI Agent Platform** built as a commercial SaaS product. Deploy intelligent voice and chat AI agents for any business use case in minutes.

## Platform Overview

Agentra AI enables businesses to create, configure, train, and deploy AI agents with:

- **7+ pre-built agent roles** (Dental Receptionist, Restaurant Ordering, Marketing AI, etc.)
- **Voice AI** powered by OpenAI Whisper (STT) + ElevenLabs/OpenAI TTS
- **Multi-language** support: English, Arabic (RTL), Urdu, French
- **Real-time streaming** conversations via Server-Sent Events
- **Admin dashboard** with analytics, conversation history, and knowledge base management

## Architecture

```
Frontend (Next.js 16)  →  API Routes  →  Prisma  →  PostgreSQL
                       →  FastAPI (AI)  →  OpenAI / ElevenLabs
```

See [ARCHITECTURE.md](./ARCHITECTURE.md) for the complete system design.

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 16, React, TypeScript, Tailwind CSS |
| UI Components | Custom Radix UI primitives, Framer Motion |
| Backend API | Next.js API Routes + FastAPI (Python) |
| Database | PostgreSQL + Prisma ORM |
| Cache | Redis |
| AI | OpenAI GPT-4o, Whisper STT |
| Voice | ElevenLabs, OpenAI TTS, Azure Voice |
| Auth | NextAuth.js v5 with JWT + Google OAuth |
| Storage | AWS S3 (configured) |
| Deploy | Docker + Kubernetes-ready |

## Agent Roles

| Role | Description | Industry |
|------|-------------|----------|
| 🦷 Dental Receptionist | Appointments, patient info, treatment Q&A | Healthcare |
| 🍽️ Restaurant Ordering | Menu, orders, delivery, kitchen notifications | Food & Beverage |
| 📱 Social Media Marketing | Content generation, campaigns, hashtags | Marketing |
| 🎧 Customer Support | Tickets, issue resolution, knowledge base | Customer Service |
| 💼 Sales Agent | Lead qualification, proposals, CRM | Sales |
| 📅 Appointment Booking | Scheduling, reminders, confirmations | General |
| 🤖 Personal Assistant | General tasks, research, productivity | General |

## Quick Start

### Prerequisites

- Node.js 18+
- Python 3.12+
- PostgreSQL 15+
- Redis 7+
- OpenAI API Key

### Local Development

```bash
# 1. Clone the repository
git clone https://github.com/your-org/agentra-ai
cd agentra-ai

# 2. Start infrastructure with Docker
docker-compose up postgres redis -d

# 3. Setup Next.js frontend
cd apps/web
cp .env.example .env
# Edit .env with your API keys

npm install
npx prisma migrate dev
npm run dev

# 4. Setup FastAPI backend (separate terminal)
cd apps/api
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

### Environment Variables

```env
# Required
DATABASE_URL=postgresql://postgres:password@localhost:5432/agentra_ai
NEXTAUTH_SECRET=your-32-char-secret
OPENAI_API_KEY=sk-your-openai-key

# Optional
ELEVENLABS_API_KEY=your-elevenlabs-key
GOOGLE_CLIENT_ID=your-google-oauth-id
GOOGLE_CLIENT_SECRET=your-google-oauth-secret
```

### Docker (Full Stack)

```bash
cp .env.example .env
# Fill in your API keys in .env
docker-compose up -d
```

Visit `http://localhost:3000`

## Project Structure

```
agentra-ai/
├── apps/
│   ├── web/                    # Next.js 16 frontend
│   │   ├── src/
│   │   │   ├── app/            # App router pages
│   │   │   │   ├── (auth)/     # Sign in, sign up
│   │   │   │   ├── (dashboard)/# Protected dashboard
│   │   │   │   └── api/        # API routes
│   │   │   ├── components/     # React components
│   │   │   ├── lib/            # Utilities, auth, db
│   │   │   └── types/          # TypeScript types
│   │   └── prisma/             # Database schema
│   └── api/                    # FastAPI AI backend
│       ├── routers/            # API endpoints
│       └── services/           # AI/Voice services
├── docker-compose.yml
└── ARCHITECTURE.md
```

## API Reference

### Chat API (Next.js)

```
POST /api/chat
{
  "agentId": "agent-id",
  "message": "Hello",
  "history": []
}
→ text/event-stream (SSE)
```

### Voice API (FastAPI)

```
POST /ai/voice/stt     # Speech-to-text (multipart audio)
POST /ai/voice/tts     # Text-to-speech
POST /ai/language/detect  # Language detection
```

### Agent Management

```
GET    /api/agents         # List agents
POST   /api/agents         # Create agent
GET    /api/agents/:id     # Get agent
PATCH  /api/agents/:id     # Update agent
DELETE /api/agents/:id     # Delete agent
```

## Development Phases

| Phase | Status | Description |
|-------|--------|-------------|
| 1 | ✅ Complete | Project setup, Auth, Dashboard, Agent Builder |
| 2 | 🔄 Next | Voice AI integration (WebRTC + streaming) |
| 3 | 📋 Planned | Dental AI module with patient management |
| 4 | 📋 Planned | Restaurant AI with kitchen integration |
| 5 | 📋 Planned | Social Media Marketing AI |
| 6 | 📋 Planned | Enterprise features, billing, SSO |

## License

MIT License — Commercial use permitted.
