from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging

from app.database.database import get_db
from app.ai.recommendation import recommend_hostels
from app.ai.chatbot import ask_ai

logger = logging.getLogger("stayspot.ai")

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/recommend")
def ai_recommend(data: dict, db: Session = Depends(get_db)):

    query = data.get("query", "")

    hostels = recommend_hostels(db, query)

    try:
        answer = ask_ai(question=query, hostels=hostels)
    except Exception:
        # Gemini API can fail for many reasons (bad key, quota, network,
        # a retired model ID) - don't crash the request, fall back to the
        # raw hostel matches. The real reason is logged below so it shows
        # up in the uvicorn console instead of vanishing silently.
        logger.exception("Gemini call failed in /ai/recommend")
        return {
            "response": "AI assistant is temporarily unavailable. Here are matching hostels based on your query.",
            "hostels": hostels,
        }

    return {"response": answer}
