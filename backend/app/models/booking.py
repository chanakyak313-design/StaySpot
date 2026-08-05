from sqlalchemy import (
    Column,
    Integer,
    String,
    ForeignKey,
    DateTime
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Booking(Base):
    __tablename__ = "bookings"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id", ondelete="CASCADE"),
        nullable=False
    )

    room_id = Column(
        Integer,
        ForeignKey("rooms.id", ondelete="CASCADE"),
        nullable=False
    )

    status = Column(String, default="Pending")

    booking_date = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    user = relationship(
        "User",
        back_populates="bookings"
    )

    room = relationship(
        "Room",
        back_populates="bookings"
    )