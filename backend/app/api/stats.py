from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.hostel import Hostel
from app.models.user import User
from app.models.booking import Booking

router = APIRouter(
    prefix="/stats",
    tags=["Stats"]
)


@router.get("/")
def public_stats(db: Session = Depends(get_db)):
    """
    Public, no-auth platform stats for the homepage - real counts, not
    placeholder marketing numbers, so what's advertised always matches
    what a visitor actually finds when they search.
    """
    total_hostels = db.query(Hostel).count()
    total_cities = db.query(func.count(func.distinct(Hostel.city))).scalar() or 0
    total_students = db.query(User).filter(User.role == "student").count()
    total_bookings = db.query(Booking).count()

    return {
        "hostels": total_hostels,
        "cities": total_cities,
        "students": total_students,
        "bookings": total_bookings,
    }
