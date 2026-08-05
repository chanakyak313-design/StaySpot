from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint
from sqlalchemy.orm import relationship

from app.database.database import Base


class Favorite(Base):
    __tablename__ = "favorites"

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

    user = relationship(
        "User",
        back_populates="favorites"
    )

    hostel = relationship(
        "Hostel",
        back_populates="favorites"
    )

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "hostel_id",
            name="unique_favorite"
        ),
    )