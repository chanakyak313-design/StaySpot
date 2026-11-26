import os
import logging
from dotenv import load_dotenv, find_dotenv
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

logger = logging.getLogger("stayspot.database")

# Robustly find and load .env from backend directory
env_path = os.path.join(os.path.dirname(os.path.dirname(os.path.dirname(__file__))), ".env")
if os.path.exists(env_path):
    load_dotenv(env_path)
else:
    load_dotenv(find_dotenv())

DATABASE_URL = os.getenv("DATABASE_URL")
engine = None

db_file_path = os.path.join(
    os.path.dirname(os.path.dirname(os.path.dirname(__file__))),
    "stayspot.db"
)

if DATABASE_URL and DATABASE_URL.strip():
    try:
        if "postgres" in DATABASE_URL:
            # Test connectivity with a fast timeout
            test_engine = create_engine(
                DATABASE_URL,
                connect_args={"connect_timeout": 2},
                pool_pre_ping=True
            )
            with test_engine.connect() as conn:
                pass
            engine = test_engine
            logger.info("Connected to PostgreSQL database successfully.")
        else:
            engine = create_engine(
                DATABASE_URL,
                connect_args={"check_same_thread": False}
            )
    except Exception as e:
        logger.warning("Could not connect to PostgreSQL: %s. Falling back to local SQLite at %s", e, db_file_path)

if engine is None:
    engine = create_engine(
        f"sqlite:///{db_file_path}",
        connect_args={"check_same_thread": False}
    )
    logger.info("Using SQLite database at %s", db_file_path)

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
