from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.booking import Booking
from app.models.review import Review

router = APIRouter(
    prefix="/dashboard",
    tags=["Dashboard"]
)


def _build_dashboard_stats(db: Session, owner_id: int):
    hostels = db.query(Hostel).filter(
        Hostel.owner_id == owner_id
    ).all()

    hostel_ids = [h.id for h in hostels]

    total_hostels = len(hostels)

    total_rooms = db.query(Room).filter(
        Room.hostel_id.in_(hostel_ids)
    ).count()

    total_bookings = (
        db.query(Booking)
        .join(Room)
        .filter(Room.hostel_id.in_(hostel_ids))
        .count()
    )

    total_available = (
        db.query(func.sum(Room.available_beds))
        .filter(Room.hostel_id.in_(hostel_ids))
        .scalar() or 0
    )

    total_beds = (
        db.query(func.sum(Room.total_beds))
        .filter(Room.hostel_id.in_(hostel_ids))
        .scalar() or 0
    )

    occupied = total_beds - total_available

    average_rating = (
        db.query(func.avg(Review.rating))
        .filter(Review.hostel_id.in_(hostel_ids))
        .scalar() or 0
    )

    revenue = db.query(
        func.sum(Room.price)
    ).join(Booking, Booking.room_id == Room.id).filter(
        Room.hostel_id.in_(hostel_ids),
        Booking.status == "Confirmed"
    ).scalar() or 0

    return {
        "total_hostels": total_hostels,
        "total_rooms": total_rooms,
        "total_bookings": total_bookings,
        "available_beds": total_available,
        "occupied_beds": occupied,
        "average_rating": round(float(average_rating), 1),
        "revenue": revenue
    }


@router.get("/")
def owner_dashboard(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    return _build_dashboard_stats(db, current_user.id)


@router.get("/{owner_id}")
def owner_dashboard_by_id(owner_id: int, db: Session = Depends(get_db)):
    return _build_dashboard_stats(db, owner_id)