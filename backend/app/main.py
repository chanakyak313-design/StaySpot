from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database.database import Base, engine

# Import SQLAlchemy models so they're registered with Base's metadata
from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.hostel_image import HostelImage
from app.models.booking import Booking
from app.models.review import Review
from app.models.favorite import Favorite

# Import API routers
from app.api.user import router as user_router
from app.api.hostel import router as hostel_router
from app.api.room import router as room_router
from app.api.hostel_images import router as hostel_images_router
from app.api.booking import router as booking_router
from app.api.review import router as review_router
from app.api.profile import router as profile_router
from app.api.dashboard import router as dashboard_router
from app.api.favorite import router as favorite_router
from app.api.admin import router as admin_router
from app.api.stats import router as stats_router
from app.api import ai
from app.api.chatbot import router as chatbot_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    # Creates any tables that don't exist yet - safe to run every startup,
    # it never touches tables that are already there. This means a fresh
    # Postgres database (just `CREATE DATABASE stayspot_db;`, nothing else)
    # works immediately without a separate migration step.
    Base.metadata.create_all(bind=engine)
    yield


app = FastAPI(
    title="StaySpot API",
    description="AI-Powered Real-Time Hostel Discovery & Vacancy Management System",
    version="1.0.0",
    lifespan=lifespan
)

# Without this, the browser blocks every request from the frontend (which
# runs on a different origin/port than the API) - JSON POST requests like
# register and /ai/recommend fail the CORS "preflight" check before they
# even reach the endpoint. No cookies/credentials are used (auth is a
# Bearer token sent manually), so a wildcard origin is safe here.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=False,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def root():
    return {
        "message": "Welcome to StaySpot API 🚀"
    }


# Register Routers
app.include_router(user_router)
app.include_router(hostel_router)
app.include_router(room_router)
app.include_router(hostel_images_router)
app.include_router(booking_router)
app.include_router(review_router)
app.include_router(profile_router)
app.include_router(dashboard_router)
app.include_router(favorite_router)
app.include_router(admin_router)
app.include_router(stats_router)
app.include_router(ai.router)
app.include_router(chatbot_router)
