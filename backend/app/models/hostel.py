from sqlalchemy import (
    Column,
    Integer,
    String,
    Float,
    Boolean,
    ForeignKey,
    DateTime,
)
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func

from app.database.database import Base


class Hostel(Base):
    __tablename__ = "hostels"

    id = Column(Integer, primary_key=True, index=True)

    owner_id = Column(Integer, ForeignKey("users.id"), nullable=False)

    hostel_name = Column(String, nullable=False)
    description = Column(String)

    city = Column(String, nullable=False)
    area = Column(String, nullable=False)
    address = Column(String, nullable=False)

    latitude = Column(Float)
    longitude = Column(Float)

    contact_number = Column(String)
    email = Column(String)

    food = Column(Boolean, default=False)
    wifi = Column(Boolean, default=False)
    parking = Column(Boolean, default=False)
    laundry = Column(Boolean, default=False)
    cctv = Column(Boolean, default=False)
    power_backup = Column(Boolean, default=False)

    rating = Column(Float, default=0)

    created_at = Column(
        DateTime(timezone=True),
        server_default=func.now()
    )

    owner = relationship(
        "User",
        back_populates="hostels"
    )

    rooms = relationship(
        "Room",
        back_populates="hostel",
        cascade="all, delete-orphan"
    )

    images = relationship(
        "HostelImage",
        back_populates="hostel",
        cascade="all, delete-orphan"
    )

    reviews = relationship(
        "Review",
        back_populates="hostel",
        cascade="all, delete-orphan"
    )

    favorites = relationship(
        "Favorite",
        back_populates="hostel",
        cascade="all, delete-orphan"
    )
