from app.database.database import Base, engine

from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.hostel_image import HostelImage


def create_tables():
    Base.metadata.create_all(bind=engine)


if __name__ == "__main__":
    create_tables()
    print("✅ Database tables created successfully!")