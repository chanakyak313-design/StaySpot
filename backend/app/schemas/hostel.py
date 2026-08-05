from typing import Optional

from pydantic import BaseModel, EmailStr

from app.schemas.room import RoomResponse


class HostelImageResponse(BaseModel):
    id: int
    image_url: str

    class Config:
        from_attributes = True


class HostelCreate(BaseModel):
    hostel_name: str
    description: Optional[str] = None

    city: str
    area: str
    address: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    contact_number: str
    email: EmailStr

    food: bool = False
    wifi: bool = False
    parking: bool = False
    laundry: bool = False
    cctv: bool = False
    power_backup: bool = False


class HostelUpdate(BaseModel):
    hostel_name: str
    description: Optional[str] = None

    city: str
    area: str
    address: str

    latitude: Optional[float] = None
    longitude: Optional[float] = None

    contact_number: str
    email: EmailStr

    food: bool
    wifi: bool
    parking: bool
    laundry: bool
    cctv: bool
    power_backup: bool


class HostelResponse(BaseModel):
    id: int
    owner_id: int

    hostel_name: str
    description: Optional[str]

    city: str
    area: str
    address: str

    latitude: Optional[float]
    longitude: Optional[float]

    contact_number: str
    email: EmailStr

    food: bool
    wifi: bool
    parking: bool
    laundry: bool
    cctv: bool
    power_backup: bool

    rating: float

    rooms: list[RoomResponse] = []
    images: list[HostelImageResponse] = []

    class Config:
        from_attributes = True