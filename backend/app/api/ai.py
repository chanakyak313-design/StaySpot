from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import logging

from app.database.database import get_db
from app.ai.recommendation import recommend_hostels
from app.ai.chatbot import ask_ai, extract_filters, build_structured_response

logger = logging.getLogger("stayspot.ai")

router = APIRouter(
    prefix="/ai",
    tags=["AI"]
)


@router.post("/recommend")
def ai_recommend(data: dict, db: Session = Depends(get_db)):
    query = data.get("query", "")

    filters = extract_filters(query)
    hostels = recommend_hostels(db, query, filters=filters)

    try:
        answer = ask_ai(question=query, hostels=hostels)
        payload = build_structured_response(query, hostels, ai_text=answer, fallback=False)
    except Exception:
        logger.exception("Gemini call failed in /ai/recommend")
        payload = build_structured_response(query, hostels, ai_text=None, fallback=True)

    return payload
