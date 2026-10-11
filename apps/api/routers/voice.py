"""
Voice AI Router
Speech-to-Text and Text-to-Speech processing
"""
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from typing import Optional
import io

from services.stt_service import STTService
from services.tts_service import TTSService

router = APIRouter()
stt_service = STTService()
tts_service = TTSService()


class TTSRequest(BaseModel):
    text: str
    voice_provider: str = "openai"
    voice_id: Optional[str] = None
    language: str = "en"
    speed: float = 1.0


class STTResponse(BaseModel):
    transcript: str
    language: str
    confidence: float


@router.post("/stt", response_model=STTResponse)
async def speech_to_text(
    audio: UploadFile = File(...),
    language: Optional[str] = Form(None),
):
    """Convert speech audio to text using Whisper"""
    try:
        audio_bytes = await audio.read()
        result = await stt_service.transcribe(
            audio_bytes=audio_bytes,
            filename=audio.filename or "audio.webm",
            language=language,
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/tts")
async def text_to_speech(request: TTSRequest):
    """Convert text to speech audio"""
    try:
        audio_stream = await tts_service.synthesize(
            text=request.text,
            provider=request.voice_provider,
            voice_id=request.voice_id,
            language=request.language,
            speed=request.speed,
        )

        return StreamingResponse(
            io.BytesIO(audio_stream),
            media_type="audio/mpeg",
            headers={
                "Content-Disposition": "attachment; filename=speech.mp3",
            },
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
