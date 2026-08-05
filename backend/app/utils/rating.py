from sqlalchemy import func
from sqlalchemy.orm import Session

from app.models.review import Review
from app.models.hostel import Hostel


def update_hostel_rating(db: Session, hostel_id: int):
    average_rating = (
        db.query(func.avg(Review.rating))
        .filter(Review.hostel_id == hostel_id)
        .scalar()
    )

    hostel = (
        db.query(Hostel)
        .filter(Hostel.id == hostel_id)
        .first()
    )

    if hostel:
        hostel.rating = round(float(average_rating), 1) if average_rating else 0

        db.commit()