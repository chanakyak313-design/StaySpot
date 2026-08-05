from sqlalchemy import (
    Column,
    Integer,
    Float,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Review(Base):
    __tablename__ = "reviews"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    hostel_id = Column(
        Integer,
        ForeignKey("hostels.id", ondelete="CASCADE"),
        nullable=False
    )

    rating = Column(Float, nullable=False)

    review = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="reviews"
    )

    hostel = relationship(
        "Hostel",
        back_populates="reviews"
    )