from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging

from app.database.database import get_db
from app.ai.chatbot import ask_ai_stream
from app.ai.recommendation import recommend_hostels

logger = logging.getLogger("stayspot.ai")

router = APIRouter(
    prefix="/chatbot",
    tags=["AI Chatbot"]
)


class ChatRequest(BaseModel):
    question: str


@router.post("/")
def chatbot(request: ChatRequest, db: Session = Depends(get_db)):
    hostels = recommend_hostels(
        db,
        request.question
    )

    def generate():
        try:
            for chunk in ask_ai_stream(question=request.question, hostels=hostels):
                yield chunk
        except Exception:
            # Gemini can fail mid-stream for many reasons (bad key, quota,
            # network, a retired model ID). Since headers are already sent
            # once streaming starts, we can't fall back to a JSON error -
            # instead we yield a plain-text apology as the "answer" itself.
            logger.exception("Gemini call failed in /chatbot/")
            yield (
                "Sorry, the AI assistant is temporarily unavailable. "
                "Please try browsing hostels directly, or try again shortly."
            )

    return StreamingResponse(generate(), media_type="text/plain")
