"""
Language Detection Router
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.language_service import LanguageService

router = APIRouter()
lang_service = LanguageService()


class DetectRequest(BaseModel):
    text: str


class DetectResponse(BaseModel):
    language: str
    language_name: str
    confidence: float
    is_rtl: bool


@router.post("/detect", response_model=DetectResponse)
async def detect_language(request: DetectRequest):
    """Detect the language of input text"""
    try:
        result = await lang_service.detect(request.text)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
