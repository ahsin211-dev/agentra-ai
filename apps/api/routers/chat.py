"""
AI Chat Processing Router
Handles multi-language, role-based AI conversations
"""
from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import List, Optional
import json
import asyncio

from services.llm_service import LLMService
from services.language_service import LanguageService

router = APIRouter()
llm_service = LLMService()
lang_service = LanguageService()


class Message(BaseModel):
    role: str
    content: str


class ChatRequest(BaseModel):
    agent_id: str
    agent_name: str
    agent_role: str
    personality: str
    instructions: str
    language: str = "auto"
    llm_model: str = "gpt-4o"
    messages: List[Message]
    stream: bool = True


class ChatResponse(BaseModel):
    content: str
    detected_language: Optional[str] = None
    tokens_used: Optional[int] = None


ROLE_SYSTEM_PROMPTS = {
    "dental_receptionist": "You are a professional dental receptionist AI. Help patients with appointments, answer dental questions, and collect patient information.",
    "restaurant_ordering": "You are a helpful restaurant ordering AI. Take orders, explain the menu, handle special requests, and process customer orders.",
    "social_media_marketing": "You are a creative social media marketing AI. Generate engaging content, campaigns, hashtags, and marketing strategies.",
    "customer_support": "You are a patient customer support AI. Resolve issues, answer questions, and ensure customer satisfaction.",
    "sales_agent": "You are a consultative sales AI. Understand customer needs, present solutions, handle objections, and guide customers to the best choice.",
    "appointment_booking": "You are an efficient appointment booking AI. Schedule, manage, and confirm appointments.",
    "personal_assistant": "You are a helpful personal AI assistant. Assist with tasks, answer questions, and help manage daily activities.",
}


def build_system_prompt(request: ChatRequest) -> str:
    role_context = ROLE_SYSTEM_PROMPTS.get(request.agent_role, "You are a helpful AI assistant.")
    
    language_instruction = (
        "Detect the user's language automatically and respond in the same language. "
        "Support English, Arabic (RTL), Urdu, and French natively."
        if request.language == "auto"
        else f"Always respond in {request.language}."
    )

    return f"""You are {request.agent_name}, an AI {request.agent_role.replace('_', ' ')} assistant.

## Role Context
{role_context}

## Personality
{request.personality}

## Core Instructions
{request.instructions}

## Language Behavior
{language_instruction}

## Key Rules
- Stay fully in character as {request.agent_name}
- Be helpful, accurate, and professional
- Never break character or discuss AI capabilities
- Keep responses natural and conversational
- For Arabic/Urdu, use proper RTL text and cultural context"""


@router.post("")
async def chat(request: ChatRequest):
    """Process AI chat with streaming support"""
    try:
        system_prompt = build_system_prompt(request)
        messages = [{"role": "system", "content": system_prompt}]
        messages.extend([{"role": m.role, "content": m.content} for m in request.messages])

        if request.stream:
            async def generate():
                async for chunk in llm_service.stream_chat(messages, request.llm_model):
                    yield f"data: {json.dumps({'delta': chunk})}\n\n"
                yield f"data: {json.dumps({'done': True})}\n\n"

            return StreamingResponse(
                generate(),
                media_type="text/event-stream",
                headers={
                    "Cache-Control": "no-cache",
                    "Connection": "keep-alive",
                },
            )
        else:
            content = await llm_service.chat(messages, request.llm_model)
            return ChatResponse(content=content)

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
