from pydantic import BaseModel


class RoomCreate(BaseModel):
    hostel_id: int
    room_type: str
    sharing_type: str
    total_beds: int
    available_beds: int
    price: float
    ac: bool
    attached_bathroom: bool


class RoomUpdate(BaseModel):
    room_type: str
    sharing_type: str
    total_beds: int
    available_beds: int
    price: float
    ac: bool
    attached_bathroom: bool


class RoomResponse(BaseModel):
    id: int
    hostel_id: int
    room_type: str
    sharing_type: str
    total_beds: int
    available_beds: int
    price: float
    ac: bool
    attached_bathroom: bool

    class Config:
        from_attributes = True