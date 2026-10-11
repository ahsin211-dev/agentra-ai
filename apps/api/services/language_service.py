"""
Language Detection Service
"""
RTL_LANGUAGES = {"ar", "he", "fa", "ur", "yi"}

LANGUAGE_NAMES = {
    "en": "English",
    "ar": "Arabic",
    "ur": "Urdu",
    "fr": "French",
    "es": "Spanish",
    "de": "German",
    "it": "Italian",
    "pt": "Portuguese",
    "ru": "Russian",
    "zh": "Chinese",
    "ja": "Japanese",
    "ko": "Korean",
    "tr": "Turkish",
    "nl": "Dutch",
    "pl": "Polish",
}


class LanguageService:
    async def detect(self, text: str) -> dict:
        """Detect language of input text"""
        try:
            from langdetect import detect, DetectorFactory
            DetectorFactory.seed = 42
            lang_code = detect(text)
        except Exception:
            lang_code = "en"

        return {
            "language": lang_code,
            "language_name": LANGUAGE_NAMES.get(lang_code, lang_code.upper()),
            "confidence": 0.90,
            "is_rtl": lang_code in RTL_LANGUAGES,
        }
