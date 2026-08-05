import os

from dotenv import load_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

# Load environment variables from .env
load_dotenv()

# Read the database URL from .env
DATABASE_URL = os.getenv("DATABASE_URL")

# Create the connection to PostgreSQL
engine = create_engine(DATABASE_URL)

# Create a session for database operations
SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

# Base class for all database models
Base = declarative_base()


# Dependency to get a database session
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()