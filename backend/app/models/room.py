from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Room(Base):
    __tablename__ = "rooms"

    id = Column(Integer, primary_key=True, index=True)

    hostel_id = Column(Integer, ForeignKey("hostels.id"), nullable=False)

    room_type = Column(String, nullable=False)

    sharing_type = Column(String, nullable=False)

    total_beds = Column(Integer, nullable=False)

    available_beds = Column(Integer, nullable=False)

    price = Column(Float, nullable=False)

    ac = Column(Boolean, default=False)

    attached_bathroom = Column(Boolean, default=False)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    hostel = relationship(
        "Hostel",
        back_populates="rooms"
    )

    bookings = relationship(
        "Booking",
        back_populates="room",
        cascade="all, delete-orphan"
    )