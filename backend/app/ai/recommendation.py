import re
from sqlalchemy.orm import Session
from app.models.hostel import Hostel
from app.models.room import Room


def recommend_hostels(db: Session, question: str):
    query = db.query(Hostel)

    q = question.lower()

    # -------- Price --------
    price = re.search(r'(\d{3,5})', q)
    if price:
        query = query.join(Room).filter(Room.price <= int(price.group(1)))

    # -------- WiFi --------
    if "wifi" in q:
        query = query.filter(Hostel.wifi == True)

    # -------- Food --------
    if "food" in q or "mess" in q:
        query = query.filter(Hostel.food == True)

    # -------- Parking --------
    if "parking" in q:
        query = query.filter(Hostel.parking == True)

    # -------- City --------
    cities = [
        "hyderabad",
        "vijayawada",
        "guntur",
        "vizag",
        "tirupati",
        "warangal",
    ]

    for city in cities:
        if city in q:
            query = query.filter(Hostel.city.ilike(f"%{city}%"))
            break

    hostels = query.distinct().limit(10).all()

    data = []

    for hostel in hostels:
        min_price = min((r.price for r in hostel.rooms), default=None)

        data.append(
            {
                "name": hostel.hostel_name,
                "city": hostel.city,
                "area": hostel.area,
                "price": min_price,
                "wifi": hostel.wifi,
                "food": hostel.food,
                "parking": hostel.parking,
                "rating": hostel.rating,
            }
        )

    return data