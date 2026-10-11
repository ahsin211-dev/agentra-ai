"""
Speech-to-Text Service
Supports: OpenAI Whisper
"""
import os
import io
from typing import Optional
from openai import AsyncOpenAI


class STTService:
    def __init__(self):
        self.client = AsyncOpenAI(api_key=os.getenv("OPENAI_API_KEY"))

    async def transcribe(
        self,
        audio_bytes: bytes,
        filename: str = "audio.webm",
        language: Optional[str] = None,
    ) -> dict:
        """Transcribe audio using OpenAI Whisper"""
        audio_file = io.BytesIO(audio_bytes)
        audio_file.name = filename

        kwargs = {
            "model": "whisper-1",
            "file": audio_file,
            "response_format": "verbose_json",
        }

        if language and language != "auto":
            kwargs["language"] = language

        response = await self.client.audio.transcriptions.create(**kwargs)

        detected_lang = getattr(response, "language", "en") or "en"

        return {
            "transcript": response.text,
            "language": detected_lang,
            "confidence": 0.95,
        }
