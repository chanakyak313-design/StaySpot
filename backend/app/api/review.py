from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.review import Review

router = APIRouter(
    prefix="/reviews",
    tags=["Reviews"]
)


@router.post("/")
def create_review(
    user_id: int,
    hostel_id: int,
    rating: int,
    comment: str,
    db: Session = Depends(get_db)
):

    new_review = Review(
        user_id=user_id,
        hostel_id=hostel_id,
        rating=rating,
        review=comment
    )

    db.add(new_review)
    db.commit()
    db.refresh(new_review)

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
        db.delete(review)
        db.commit()

    return {"message": "Review deleted"}