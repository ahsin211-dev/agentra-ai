"""
Text-to-Speech Service
Supports: OpenAI TTS, ElevenLabs, Azure, Google
"""
import os
from typing import Optional
from openai import AsyncOpenAI


class TTSService:
    def __init__(self):
        self.openai_client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))
        self.elevenlabs_key = os.getenv("ELEVENLABS_API_KEY")

    async def synthesize(
        self,
        text: str,
        provider: str = "openai",
        voice_id: Optional[str] = None,
        language: str = "en",
        speed: float = 1.0,
    ) -> bytes:
        """Convert text to speech audio"""
        if provider == "openai":
            return await self._openai_tts(text, voice_id, speed)
        elif provider == "elevenlabs" and self.elevenlabs_key:
            return await self._elevenlabs_tts(text, voice_id)
        else:
            return await self._openai_tts(text, voice_id, speed)

    async def _openai_tts(
        self,
        text: str,
        voice_id: Optional[str] = None,
        speed: float = 1.0,
    ) -> bytes:
        voice = voice_id or "nova"
        valid_voices = ["alloy", "echo", "fable", "onyx", "nova", "shimmer"]
        if voice not in valid_voices:
            voice = "nova"

        response = await self.openai_client.audio.speech.create(
            model="tts-1",
            voice=voice,
            input=text,
            speed=min(max(speed, 0.25), 4.0),
        )
        return response.content

    async def _elevenlabs_tts(self, text: str, voice_id: Optional[str]) -> bytes:
        import httpx
        vid = voice_id or "21m00Tcm4TlvDq8ikWAM"
        url = f"https://api.elevenlabs.io/v1/text-to-speech/{vid}"
        headers = {
            "xi-api-key": self.elevenlabs_key,
            "Content-Type": "application/json",
        }
        payload = {
            "text": text,
            "model_id": "eleven_multilingual_v2",
            "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
        }
        async with httpx.AsyncClient() as client:
            response = await client.post(url, json=payload, headers=headers)
            response.raise_for_status()
            return response.content
