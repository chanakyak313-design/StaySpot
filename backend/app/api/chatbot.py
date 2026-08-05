from fastapi import APIRouter, Depends
from pydantic import BaseModel
from sqlalchemy.orm import Session
import logging

from app.database.database import get_db
from app.ai.chatbot import ask_ai
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

    try:
        answer = ask_ai(
            question=request.question,
            hostels=hostels
        )
    except Exception:
        logger.exception("Gemini call failed in /chatbot/")
        answer = (
            "Sorry, the AI assistant is temporarily unavailable. "
            "Please try browsing hostels directly, or try again shortly."
        )

    return {
        "answer": answer
    }