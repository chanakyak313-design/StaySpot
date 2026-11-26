from datetime import datetime
from typing import Optional
from pydantic import BaseModel


class BookingCreate(BaseModel):
    room_id: int


class BookingResponse(BaseModel):
    id: int
    user_id: int
    room_id: int
    status: str
    booking_date: datetime

    hostel_id: Optional[int] = None
    hostel_name: Optional[str] = None
    city: Optional[str] = None
    area: Optional[str] = None
    room_type: Optional[str] = None
    sharing_type: Optional[str] = None
    price: Optional[float] = None
    image_url: Optional[str] = None

    class Config:
        from_attributes = True
