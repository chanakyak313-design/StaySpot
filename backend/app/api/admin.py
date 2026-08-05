from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db

from app.models.user import User
from app.models.hostel import Hostel
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

    return {
        "users": db.query(User).count(),
        "hostels": db.query(Hostel).count(),
        "bookings": db.query(Booking).count(),
        "reviews": db.query(Review).count()
    }


@router.get("/users", response_model=list[UserResponse])
def users(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(User).all()


@router.get("/hostels", response_model=list[HostelResponse])
def hostels(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Hostel).all()


@router.get("/bookings")
def bookings(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Booking).all()


@router.get("/reviews")
def reviews(db: Session = Depends(get_db), _: User = Depends(require_admin)):
    return db.query(Review).all()


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
