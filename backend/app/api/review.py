from typing import Optional
from datetime import datetime, timezone
from fastapi import APIRouter, Depends, HTTPException, Body
from pydantic import BaseModel
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.review import Review
from app.models.hostel import Hostel
from app.models.user import User

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


class ReviewInput(BaseModel):
    user_id: Optional[int] = None
    hostel_id: Optional[int] = None
    rating: int
    comment: str


def _recalculate_hostel_rating(db: Session, hostel_id: int):
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()
    if hostel is None:
        return

    average = (
        db.query(func.avg(Review.rating))
        .filter(Review.hostel_id == hostel_id)
        .scalar()
    )

    hostel.rating = round(float(average), 1) if average is not None else 0.0
    db.commit()


@router.post("/")
def create_review(
    user_id: Optional[int] = None,
    hostel_id: Optional[int] = None,
    rating: Optional[int] = None,
    comment: Optional[str] = None,
    body: Optional[ReviewInput] = Body(None),
    db: Session = Depends(get_db)
):
    final_user_id = user_id or (body.user_id if body else None)
    final_hostel_id = hostel_id or (body.hostel_id if body else None)
    final_rating = rating if rating is not None else (body.rating if body else None)
    final_comment = comment or (body.comment if body else None)

    if not final_user_id or not final_hostel_id or final_rating is None or not final_comment:
        raise HTTPException(status_code=400, detail="Missing required review fields (user_id, hostel_id, rating, comment)")

    if not (1 <= final_rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    hostel = db.query(Hostel).filter(Hostel.id == final_hostel_id).first()
    if hostel is None:
        raise HTTPException(status_code=404, detail="Hostel not found")

    new_review = Review(
        user_id=final_user_id,
        hostel_id=final_hostel_id,
        rating=final_rating,
        review=final_comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    _recalculate_hostel_rating(db, final_hostel_id)

    user = db.query(User).filter(User.id == final_user_id).first()

    return {
        "id": new_review.id,
        "user_id": new_review.user_id,
        "hostel_id": new_review.hostel_id,
        "rating": new_review.rating,
        "review": new_review.review,
        "created_at": new_review.created_at.isoformat() if new_review.created_at else datetime.now(timezone.utc).isoformat(),
        "user_name": user.full_name if user else f"Student #{new_review.user_id}",
    }


@router.get("/featured")
def get_featured_reviews(db: Session = Depends(get_db)):
    """
    Top-rated reviews across all hostels for testimonials on the homepage.
    """
    rows = (
        db.query(Review, Hostel.hostel_name, User.full_name)
        .join(Hostel, Review.hostel_id == Hostel.id)
        .join(User, Review.user_id == User.id)
        .filter(Review.rating >= 4)
        .order_by(Review.rating.desc(), Review.created_at.desc())
        .limit(6)
        .all()
    )

    return [
        {
            "id": review.id,
            "rating": review.rating,
            "review": review.review,
            "hostel_name": hostel_name,
            "user_name": user_name,
        }
        for review, hostel_name, user_name in rows
    ]


@router.get("/{hostel_id}")
def get_reviews(
    hostel_id: int,
    db: Session = Depends(get_db)
):
    rows = (
        db.query(Review, User.full_name)
        .outerjoin(User, Review.user_id == User.id)
        .filter(Review.hostel_id == hostel_id)
        .order_by(Review.created_at.desc())
        .all()
    )

    return [
        {
            "id": r.id,
            "user_id": r.user_id,
            "hostel_id": r.hostel_id,
            "rating": r.rating,
            "review": r.review,
            "created_at": r.created_at.isoformat() if r.created_at else datetime.now(timezone.utc).isoformat(),
            "user_name": full_name or f"Verified Student #{r.user_id}",
        }
        for r, full_name in rows
    ]


@router.delete("/{review_id}")
def delete_review(
    review_id: int,
    db: Session = Depends(get_db)
):
    review = (
        db.query(Review)
        .filter(Review.id == review_id)
        .first()
    )

    if review:
        hostel_id = review.hostel_id
        db.delete(review)
        db.commit()
        _recalculate_hostel_rating(db, hostel_id)

    return {"message": "Review deleted"}
