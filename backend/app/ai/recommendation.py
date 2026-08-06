import re
from sqlalchemy.orm import Session
from app.models.hostel import Hostel
from app.models.room import Room


def _serialize(hostels: list[Hostel]) -> list[dict]:
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


def recommend_hostels_by_filters(db: Session, filters: dict) -> list[dict]:
    """
    Builds a hostel search from structured filters (as extracted by Gemini
    from a natural-language question) rather than a hardcoded city list or
    a single regex - so "near Gachibowli under 6k with AC" actually works,
    not just "Hyderabad" + a bare number.
    """
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
    """
    Simple keyword/regex fallback used only if Gemini-based filter
    extraction is unavailable (bad key, quota, network). Deliberately
    dependency-free so the search never goes completely blank.
    """
    query = db.query(Hostel)
    q = question.lower()

    price = re.search(r'(\d{3,6})', q)
    if price:
        query = query.join(Room).filter(Room.price <= int(price.group(1)))

    if "wifi" in q:
        query = query.filter(Hostel.wifi.is_(True))

    if "food" in q or "mess" in q:
        query = query.filter(Hostel.food.is_(True))

    if "parking" in q:
        query = query.filter(Hostel.parking.is_(True))

    hostels = query.distinct().limit(10).all()
    return _serialize(hostels)


def recommend_hostels(db: Session, question: str, filters: dict | None = None) -> list[dict]:
    """
    Main entry point: uses structured filters when available (from Gemini
    extraction), otherwise falls back to basic keyword matching.
    """
    if filters and any(filters.values()):
        # Gemini understood something concrete - trust it fully, even if
        # that means zero results. That's the honest answer to what the
        # student actually asked for, not a reason to quietly widen the
        # search behind their back.
        return recommend_hostels_by_filters(db, filters)

    return recommend_hostels_basic(db, question)
