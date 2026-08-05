from datetime import datetime
from pydantic import BaseModel


class BookingCreate(BaseModel):
    room_id: int


class BookingResponse(BaseModel):
    id: int
    user_id: int
    room_id: int
    status: str
    booking_date: datetime

    class Config:
        from_attributes = True