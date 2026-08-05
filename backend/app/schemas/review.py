from datetime import datetime
from pydantic import BaseModel


class ReviewCreate(BaseModel):
    hostel_id: int
    rating: float
    review: str


class ReviewUpdate(BaseModel):
    rating: float
    review: str


class ReviewResponse(BaseModel):
    id: int
    user_id: int
    hostel_id: int
    rating: float
    review: str
    created_at: datetime

    class Config:
        from_attributes = True