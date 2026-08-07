from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from sqlalchemy import func

from app.database.database import get_db
from app.models.review import Review
from app.models.hostel import Hostel

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


def _recalculate_hostel_rating(db: Session, hostel_id: int):
    """
    Hostel.rating is a stored average, not computed on the fly, so it has
    to be refreshed any time a review is added or removed - otherwise it
    just sits frozen at whatever it started as.
    """
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
    user_id: int,
    hostel_id: int,
    rating: int,
    comment: str,
    db: Session = Depends(get_db)
):
    if not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()
    if hostel is None:
        raise HTTPException(status_code=404, detail="Hostel not found")

    new_review = Review(
        user_id=user_id,
        hostel_id=hostel_id,
        rating=rating,
        review=comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

    _recalculate_hostel_rating(db, hostel_id)

    return new_review


@router.get("/{hostel_id}")
def get_reviews(
    hostel_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(Review)
        .filter(Review.hostel_id == hostel_id)
        .all()
    )


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
