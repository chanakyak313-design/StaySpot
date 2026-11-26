import os
import json
import logging
from dotenv import load_dotenv, find_dotenv

logger = logging.getLogger("stayspot.ai")

# Robustly find and load .env
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv(find_dotenv())

_client = None

def get_client():
    global _client
    if _client is not None:
        return _client
    api_key = os.getenv("GEMINI_API_KEY", "").strip()
    if not api_key or not api_key.startswith("AIzaSy"):
        logger.info("Valid GEMINI_API_KEY (starting with 'AIzaSy') not configured. Running in fast instant matching mode.")
        return None
    try:
        from google import genai
        _client = genai.Client(api_key=api_key, http_options={"timeout": 12000})
        return _client
    except Exception as e:
        logger.warning("Failed to initialize Google GenAI Client: %s", e)
        return None

MODEL = "gemini-2.5-flash"


def extract_filters(question: str) -> dict | None:
    """
    Uses Gemini to pull structured search filters out of a natural-language
    question, e.g. "hostel near Gachibowli under 6000 with wifi and ac"
    becomes {"area": "Gachibowli", "max_price": 6000, "wifi": true, "ac": true}.

    Returns None on any failure so the caller can fall back to simpler keyword matching.
    """
    client = get_client()
    if not client:
        return None

    prompt = f"""
Extract hostel search filters from this user question as a JSON object.
Only include keys that are clearly mentioned - do not guess or invent values.

Possible keys:
- city (string)
- area (string - a locality/neighbourhood, not a whole city)
- max_price (number - monthly rent ceiling, e.g. "under 6000" or "less than 5k" -> 5000)
- wifi (true)
- food (true)
- parking (true)
- ac (true)
- laundry (true)
- sharing_type (one of: "Single", "Double", "Triple", "Four", "Six", "Eight")

Question: "{question}"

Respond with ONLY the JSON object and nothing else - no markdown fences, no explanation.
"""

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt,
            config={"response_mime_type": "application/json"},
        )
        filters = json.loads(response.text)
        return filters if isinstance(filters, dict) else None
    except Exception:
        logger.exception("Filter extraction failed, falling back to keyword matching")
        return None


def _format_history(history: list[dict]) -> str:
    """
    Formats prior turns into a transcript so Gemini has context of the
    conversation instead of treating every message as the first one.
    """
    if not history:
        return ""

    lines = []
    for turn in history[-10:]:
        speaker = "Student" if turn.get("sender") == "user" else "StaySpot AI"
        text = (turn.get("text") or "").strip()
        if text:
            lines.append(f"{speaker}: {text}")

    if not lines:
        return ""

    return "Conversation so far:\n" + "\n".join(lines) + "\n"


def _build_prompt(question: str, hostels: list, history: list[dict] | None = None) -> str:
    hostel_text = ""

    for h in hostels:
        hostel_text += f"""
Name: {h.get('name', 'Hostel')}
City: {h.get('city', '')}
Area: {h.get('area', '')}
Price: ₹{h.get('price', 'N/A')}
WiFi: {h.get('wifi', False)}
Food: {h.get('food', False)}
Parking: {h.get('parking', False)}
Rating: {h.get('rating', 'New')}

"""

    history_text = _format_history(history or [])

    return f"""You are StaySpot AI, an intelligent, empathetic hostel and PG finder assistant for students across India.

Available hostels matching the current search:

{hostel_text}

Guidelines:
1. Recommend top hostels from the list above that best match what the student requested.
2. Highlight important factors: monthly rent in ₹, locality/proximity, and amenities (WiFi, Food, AC).
3. If no hostels match, kindly suggest widening their budget or checking nearby areas.
4. Keep answers friendly, crisp, and under 130 words.

{history_text}
Latest Question: {question}
"""


def build_structured_response(question: str, hostels: list, ai_text: str | None = None, fallback: bool = False) -> dict:
    hostel_count = len(hostels or [])
    top_hostels = (hostels or [])[:3]

    if hostel_count == 0:
        body_lines = [
            "No verified hostels matched your exact criteria.",
            "💡 Tip: Try expanding your budget range or selecting nearby localities."
        ]
    else:
        body_lines = [f"Found {hostel_count} verified hostel(s) matching your search:"]
        for hostel in top_hostels:
            name = hostel.get("name", "Unnamed hostel")
            area = hostel.get("area") or "Central"
            city = hostel.get("city") or ""
            price = hostel.get("price") or "N/A"
            rating = hostel.get("rating") or "New"
            body_lines.append(
                f"• {name} — {area}, {city} (₹{price}/mo • ⭐ {rating}/5)"
            )

    if ai_text and ai_text.strip():
        response_text = f"{ai_text.strip()}\n\n" + "\n".join(body_lines)
    elif fallback:
        response_text = "Here are the top matches curated for your request:\n\n" + "\n".join(body_lines)
    else:
        response_text = "\n".join(body_lines)

    return {
        "response": response_text,
        "hostels": hostels or [],
        "meta": {
            "used_ai": bool(ai_text and ai_text.strip()),
            "fallback": fallback,
            "hostel_count": hostel_count,
            "question": question,
        },
    }


def ask_ai(question: str, hostels: list, history: list[dict] | None = None):
    client = get_client()
    if not client:
        payload = build_structured_response(question, hostels, ai_text=None, fallback=True)
        return payload["response"]

    prompt = _build_prompt(question, hostels, history)

    try:
        response = client.models.generate_content(
            model=MODEL,
            contents=prompt
        )
        return response.text
    except Exception as e:
        logger.warning("Gemini ask_ai failed: %s, falling back to structured summary", e)
        payload = build_structured_response(question, hostels, ai_text=None, fallback=True)
        return payload["response"]


def ask_ai_stream(question: str, hostels: list, history: list[dict] | None = None):
    """
    Yields the response text chunk by chunk as it streams in from Gemini,
    or falls back to a clean generator of structured recommendation text.
    """
    client = get_client()
    if not client:
        summary = build_structured_response(question, hostels, ai_text=None, fallback=True)["response"]
        for word in summary.split(" "):
            yield word + " "
        return

    prompt = _build_prompt(question, hostels, history)

    try:
        stream = client.models.generate_content_stream(
            model=MODEL,
            contents=prompt
        )
        for chunk in stream:
            if chunk.text:
                yield chunk.text
    except Exception as e:
        logger.warning("Gemini stream failed: %s, falling back to structured summary", e)
        summary = build_structured_response(question, hostels, ai_text=None, fallback=True)["response"]
        for word in summary.split(" "):
            yield word + " "
