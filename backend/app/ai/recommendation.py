import re
from sqlalchemy.orm import Session
from app.models.hostel import Hostel
from app.models.room import Room


def _serialize(hostels: list[Hostel]) -> list[dict]:
    data = []

    for hostel in hostels:
        min_price = min((r.price for r in hostel.rooms), default=None)
        image_url = hostel.images[0].image_url if hostel.images else "https://picsum.photos/seed/hostel/600/400"

        data.append(
            {
                "id": hostel.id,
                "name": hostel.hostel_name,
                "hostel_name": hostel.hostel_name,
                "city": hostel.city,
                "area": hostel.area,
                "address": hostel.address,
                "price": min_price,
                "wifi": hostel.wifi,
                "food": hostel.food,
                "parking": hostel.parking,
                "rating": hostel.rating,
                "image": image_url,
                "image_url": image_url,
                "images": [{"image_url": image_url}],
                "rooms": [{"price": min_price}] if min_price else [],
            }
        )

    return data


def recommend_hostels_by_filters(db: Session, filters: dict) -> list[dict]:
    query = db.query(Hostel)
    needs_room_join = False

    if filters.get("city"):
        query = query.filter(Hostel.city.ilike(f"%{filters['city']}%"))

    if filters.get("area"):
        query = query.filter(Hostel.area.ilike(f"%{filters['area']}%"))

    if filters.get("wifi"):
        query = query.filter(Hostel.wifi.is_(True))

    if filters.get("food"):
        query = query.filter(Hostel.food.is_(True))

    if filters.get("parking"):
        query = query.filter(Hostel.parking.is_(True))

    if filters.get("laundry"):
        query = query.filter(Hostel.laundry.is_(True))

    max_price = filters.get("max_price")
    if max_price is not None:
        try:
            query = query.join(Room)
            needs_room_join = True
            query = query.filter(Room.price <= float(max_price))
        except (TypeError, ValueError):
            pass

    if filters.get("ac"):
        if not needs_room_join:
            query = query.join(Room)
            needs_room_join = True
        query = query.filter(Room.ac.is_(True))

    if filters.get("sharing_type"):
        if not needs_room_join:
            query = query.join(Room)
            needs_room_join = True
        query = query.filter(Room.sharing_type.ilike(f"%{filters['sharing_type']}%"))

    hostels = query.distinct().limit(10).all()
    return _serialize(hostels)


def recommend_hostels_basic(db: Session, question: str) -> list[dict]:
    query = db.query(Hostel)
    q = question.lower()
    has_room_join = False

    # City detection
    cities = ["hyderabad", "bangalore", "bengaluru", "pune", "mumbai", "delhi", "chennai", "kolkata"]
    for c in cities:
        if c in q:
            match_city = "Bangalore" if c == "bengaluru" else c.capitalize()
            query = query.filter(Hostel.city.ilike(f"%{match_city}%"))
            break

    # Price detection
    price = re.search(r'(\d{3,6})', q)
    if price:
        query = query.join(Room)
        has_room_join = True
        query = query.filter(Room.price <= int(price.group(1)))

    if "wifi" in q:
        query = query.filter(Hostel.wifi.is_(True))

    if "food" in q or "mess" in q:
        query = query.filter(Hostel.food.is_(True))

    if "parking" in q:
        query = query.filter(Hostel.parking.is_(True))

    if "ac" in q:
        if not has_room_join:
            query = query.join(Room)
            has_room_join = True
        query = query.filter(Room.ac.is_(True))

    hostels = query.distinct().limit(10).all()
    # If no results from strict regex, return top-rated hostels
    if not hostels:
        hostels = db.query(Hostel).order_by(Hostel.rating.desc()).limit(6).all()

    return _serialize(hostels)


def recommend_hostels(db: Session, question: str, filters: dict | None = None) -> list[dict]:
    if filters and any(filters.values()):
        results = recommend_hostels_by_filters(db, filters)
        if results:
            return results

    return recommend_hostels_basic(db, question)
