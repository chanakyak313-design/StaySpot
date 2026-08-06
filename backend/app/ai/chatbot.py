import os
import json
import logging
from dotenv import load_dotenv
from google import genai

load_dotenv()

logger = logging.getLogger("stayspot.ai")

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)

MODEL = "gemini-flash-latest"


def extract_filters(question: str) -> dict | None:
    """
    Uses Gemini to pull structured search filters out of a natural-language
    question, e.g. "hostel near Gachibowli under 6000 with wifi and ac"
    becomes {"area": "Gachibowli", "max_price": 6000, "wifi": true, "ac": true}.

    Returns None on any failure (bad key, quota, network, bad JSON back) so
    the caller can fall back to simpler keyword matching instead of breaking.
    """
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
    Expects a list of {"sender": "user" | "bot", "text": str}.
    """
    if not history:
        return ""

    lines = []
    for turn in history[-10:]:  # keep the prompt bounded to recent context
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
Name: {h['name']}
City: {h['city']}
Area: {h['area']}
Price: ₹{h['price']}
WiFi: {h['wifi']}
Food: {h['food']}
Parking: {h['parking']}
Rating: {h['rating']}

"""

    history_text = _format_history(history or [])

    return f"""
You are StaySpot AI. You help students find the best hostel.

Available hostels matching the current search:

{hostel_text}

Use ONLY the above hostel data while answering - never invent a hostel
that isn't listed. If the list is empty, say so plainly and suggest
widening the search (different city, higher budget, fewer filters).

{history_text}
Use the conversation above for context (e.g. if the student is following
up on something they already asked), but answer the latest question.

Keep answers under 120 words.

Latest Question:

{question}
"""


def ask_ai(question: str, hostels: list, history: list[dict] | None = None):
    prompt = _build_prompt(question, hostels, history)

    response = client.models.generate_content(
        model=MODEL,
        contents=prompt
    )

    return response.text


def ask_ai_stream(question: str, hostels: list, history: list[dict] | None = None):
    """
    Same as ask_ai, but yields the response text chunk by chunk as it
    streams in from Gemini, instead of waiting for the full response.
    """
    prompt = _build_prompt(question, hostels, history)

    stream = client.models.generate_content_stream(
        model=MODEL,
        contents=prompt
    )

    for chunk in stream:
        if chunk.text:
            yield chunk.text
