"""
Agentra AI — FastAPI Backend
AI Voice + Agent Processing Engine
"""
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from routers import chat, voice, language, health

app = FastAPI(
    title="Agentra AI API",
    description="AI Voice + Agent Processing Engine",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://app.agentra.ai"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/health", tags=["Health"])
app.include_router(chat.router, prefix="/ai/chat", tags=["Chat AI"])
app.include_router(voice.router, prefix="/ai/voice", tags=["Voice AI"])
app.include_router(language.router, prefix="/ai/language", tags=["Language"])


@app.get("/")
async def root():
    return {
        "service": "Agentra AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs",
    }
