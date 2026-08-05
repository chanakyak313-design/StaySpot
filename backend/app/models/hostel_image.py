from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship

from app.database.database import Base


class HostelImage(Base):
    __tablename__ = "hostel_images"

    id = Column(Integer, primary_key=True, index=True)

    hostel_id = Column(
        Integer,
        ForeignKey("hostels.id", ondelete="CASCADE"),
        nullable=False
    )

    image_url = Column(String, nullable=False)

    hostel = relationship(
        "Hostel",
        back_populates="images"
    )