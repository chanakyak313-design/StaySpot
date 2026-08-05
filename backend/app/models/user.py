from sqlalchemy import Column, Integer, String, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    phone = Column(String, unique=True, nullable=False)
    password = Column(String, nullable=False)
    role = Column(String, nullable=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    hostels = relationship(
        "Hostel",
        back_populates="owner",
        cascade="all, delete-orphan"
    )

    bookings = relationship(
        "Booking",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    reviews = relationship(
        "Review",
        back_populates="user",
        cascade="all, delete-orphan"
    )

    favorites = relationship(
        "Favorite",
        back_populates="user",
        cascade="all, delete-orphan"
    )