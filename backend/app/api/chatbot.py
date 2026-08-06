from fastapi import APIRouter, Depends
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging

from app.database.database import get_db
from app.ai.chatbot import ask_ai_stream, extract_filters
from app.ai.recommendation import recommend_hostels

logger = logging.getLogger("stayspot.ai")

router = APIRouter(
    prefix="/chatbot",
    tags=["AI Chatbot"]
)


class ChatTurn(BaseModel):
    sender: str  # "user" or "bot"
    text: str


class ChatRequest(BaseModel):
    question: str
    history: list[ChatTurn] = []


@router.post("/")
def chatbot(request: ChatRequest, db: Session = Depends(get_db)):
    # Ask Gemini to pull structured filters (city, budget, amenities...) out
    # of the natural-language question, so "hostel near Gachibowli under
    # 6k with AC" actually narrows the search properly instead of falling
    # back to a single crude regex every time.
    filters = extract_filters(request.question)

    hostels = recommend_hostels(
        db,
        request.question,
        filters=filters
    )

    history = [turn.model_dump() for turn in request.history]

    def generate():
        try:
            for chunk in ask_ai_stream(
                question=request.question,
                hostels=hostels,
                history=history
            ):
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
