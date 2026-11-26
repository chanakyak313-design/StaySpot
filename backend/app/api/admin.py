from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db

from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.booking import Booking
from app.models.review import Review
from app.schemas.user import UserResponse
from app.schemas.hostel import HostelResponse
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/admin",
    tags=["Admin"]
)


def require_admin(current_user: User = Depends(get_current_user)) -> User:
    if current_user.role.lower() != "admin":
        raise HTTPException(status_code=403, detail="Admin access only.")
    return current_user


@router.get("/dashboard")
def dashboard(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    total_users = db.query(User).count()
    total_hostels = db.query(Hostel).count()
    total_bookings = db.query(Booking).count()
    total_reviews = db.query(Review).count()

    revenue = db.query(
        func.sum(Room.price)
    ).join(Booking, Booking.room_id == Room.id).filter(
        Booking.status == "Confirmed"
    ).scalar() or 0

    return {
        "users": total_users,
        "hostels": total_hostels,
        "bookings": total_bookings,
        "reviews": total_reviews,
        "revenue": revenue
    }


@router.get("/users", response_model=list[UserResponse])
def users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).order_by(User.id.desc()).all()


@router.get("/hostels", response_model=list[HostelResponse])
def hostels(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Hostel).order_by(Hostel.id.desc()).all()


@router.get("/bookings")
def bookings(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    all_b = db.query(Booking).order_by(Booking.booking_date.desc()).all()
    results = []
    for b in all_b:
        user = db.query(User).filter(User.id == b.user_id).first()
        room = db.query(Room).filter(Room.id == b.room_id).first()
        hostel = db.query(Hostel).filter(Hostel.id == room.hostel_id).first() if room else None
        results.append({
            "id": b.id,
            "user_id": b.user_id,
            "user_name": user.full_name if user else f"User #{b.user_id}",
            "room_id": b.room_id,
            "status": b.status,
            "booking_date": b.booking_date.isoformat() if b.booking_date else None,
            "hostel_name": hostel.hostel_name if hostel else "-",
            "city": hostel.city if hostel else "-",
            "price": room.price if room else 0,
        })
    return results


@router.get("/reviews")
def reviews(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    all_r = db.query(Review).order_by(Review.id.desc()).all()
    results = []
    for r in all_r:
        user = db.query(User).filter(User.id == r.user_id).first()
        hostel = db.query(Hostel).filter(Hostel.id == r.hostel_id).first()
        results.append({
            "id": r.id,
            "rating": r.rating,
            "review": r.review,
            "user_name": user.full_name if user else f"User #{r.user_id}",
            "hostel_name": hostel.hostel_name if hostel else "-",
            "created_at": r.created_at.isoformat() if r.created_at else None,
        })
    return results


@router.delete("/users/{user_id}")
def delete_user(user_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    user = db.query(User).filter(User.id == user_id).first()

    if not user:
        raise HTTPException(status_code=404, detail="User not found")

    db.delete(user)
    db.commit()

    return {"message": "User deleted successfully"}


@router.delete("/hostels/{hostel_id}")
def admin_delete_hostel(hostel_id: int, db: Session = Depends(get_db), _: User = Depends(require_admin)):
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()

    if not hostel:
        raise HTTPException(status_code=404, detail="Hostel not found")

    db.delete(hostel)
    db.commit()

    return {"message": "Hostel deleted successfully"}
