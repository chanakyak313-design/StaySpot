import os
from dotenv import load_dotenv
from google import genai

load_dotenv()

client = genai.Client(
    api_key=os.getenv("GEMINI_API_KEY")
)


def _build_prompt(question: str, hostels: list) -> str:
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

    return f"""
You are StaySpot AI.

You help students find the best hostel.

Available hostels:

{hostel_text}

Use ONLY the above hostel data while answering.

If the user asks for hostel recommendations,
recommend the most suitable hostel from the list.

Keep answers under 120 words.

User Question:

{question}
"""


def ask_ai(question: str, hostels: list):
    prompt = _build_prompt(question, hostels)

    response = client.models.generate_content(
        model="gemini-flash-latest",
        contents=prompt
    )

    return response.text


def ask_ai_stream(question: str, hostels: list):
    """
    Same as ask_ai, but yields the response text chunk by chunk as it
    streams in from Gemini, instead of waiting for the full response.
    """
    prompt = _build_prompt(question, hostels)

    stream = client.models.generate_content_stream(
        model="gemini-flash-latest",
        contents=prompt
    )

    for chunk in stream:
        if chunk.text:
            yield chunk.text
