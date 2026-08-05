from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room

from app.schemas.room import (
    RoomCreate,
    RoomUpdate,
    RoomResponse
)

router = APIRouter(
    prefix="/rooms",
    tags=["Rooms"]
)


# ---------------- Create Room ----------------

@router.post("/", response_model=RoomResponse)
def create_room(
    room: RoomCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    hostel = db.query(Hostel).filter(
        Hostel.id == room.hostel_id
    ).first()

    if hostel is None:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    if hostel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can add rooms only to your own hostel."
        )

    new_room = Room(
        hostel_id=room.hostel_id,
        room_type=room.room_type,
        sharing_type=room.sharing_type,
        total_beds=room.total_beds,
        available_beds=room.available_beds,
        price=room.price,
        ac=room.ac,
        attached_bathroom=room.attached_bathroom
    )

    db.add(new_room)
    db.commit()
    db.refresh(new_room)

    return new_room
# ---------------- Get All Rooms ----------------

@router.get("/", response_model=list[RoomResponse])
def get_all_rooms(db: Session = Depends(get_db)):
    rooms = db.query(Room).all()
    return rooms

# ---------------- Get Rooms by Hostel ID ----------------

@router.get("/hostel/{hostel_id}", response_model=list[RoomResponse])
def get_rooms_by_hostel(hostel_id: int, db: Session = Depends(get_db)):
    rooms = db.query(Room).filter(Room.hostel_id == hostel_id).all()
    return rooms
# ---------------- Get Room By ID ----------------

@router.get("/{room_id}", response_model=RoomResponse)
def get_room_by_id(
    room_id: int,
    db: Session = Depends(get_db)
):
    room = db.query(Room).filter(Room.id == room_id).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    return room
# ---------------- Update Room ----------------

@router.put("/{room_id}", response_model=RoomResponse)
def update_room(
    room_id: int,
    room: RoomUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_room = db.query(Room).filter(Room.id == room_id).first()

    if db_room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    hostel = db.query(Hostel).filter(
        Hostel.id == db_room.hostel_id
    ).first()

    if hostel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can update only your own rooms."
        )

    db_room.room_type = room.room_type
    db_room.sharing_type = room.sharing_type
    db_room.total_beds = room.total_beds
    db_room.available_beds = room.available_beds
    db_room.price = room.price
    db_room.ac = room.ac
    db_room.attached_bathroom = room.attached_bathroom

    db.commit()
    db.refresh(db_room)

    return db_room
# ---------------- Delete Room ----------------

@router.delete("/{room_id}")
def delete_room(
    room_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    db_room = db.query(Room).filter(Room.id == room_id).first()

    if db_room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    hostel = db.query(Hostel).filter(
        Hostel.id == db_room.hostel_id
    ).first()

    if hostel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own rooms."
        )

    db.delete(db_room)
    db.commit()

    return {
        "message": "Room deleted successfully."
    }
