from typing import Optional

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session, joinedload

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room

from app.schemas.hostel import (
    HostelCreate,
    HostelUpdate,
    HostelResponse
)

router = APIRouter(
    prefix="/hostels",
    tags=["Hostels"]
)

# ---------------- Create Hostel ----------------

@router.post("/", response_model=HostelResponse)
def create_hostel(
    hostel: HostelCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.role.lower() not in ("owner", "admin"):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Only hostel owners or admins can create hostels."
        )

    new_hostel = Hostel(
        owner_id=current_user.id,
        hostel_name=hostel.hostel_name,
        description=hostel.description,
        city=hostel.city,
        area=hostel.area,
        address=hostel.address,
        latitude=hostel.latitude,
        longitude=hostel.longitude,
        contact_number=hostel.contact_number,
        email=hostel.email,
        food=hostel.food,
        wifi=hostel.wifi,
        parking=hostel.parking,
        laundry=hostel.laundry,
        cctv=hostel.cctv,
        power_backup=hostel.power_backup
    )

    db.add(new_hostel)
    db.commit()
    db.refresh(new_hostel)

    return new_hostel


# ---------------- Get All Hostels ----------------

@router.get("/", response_model=list[HostelResponse])
def get_all_hostels(
    city: Optional[str] = Query(None),
    area: Optional[str] = Query(None),
    wifi: Optional[bool] = Query(None),
    food: Optional[bool] = Query(None),
    parking: Optional[bool] = Query(None),
    db: Session = Depends(get_db)
):
    query = db.query(Hostel).options(
        joinedload(Hostel.rooms),
        joinedload(Hostel.images)
    )

    if city:
        query = query.filter(Hostel.city.ilike(f"%{city}%"))

    if area:
        query = query.filter(Hostel.area.ilike(f"%{area}%"))

    if wifi is not None:
        query = query.filter(Hostel.wifi == wifi)

    if food is not None:
        query = query.filter(Hostel.food == food)

    if parking is not None:
        query = query.filter(Hostel.parking == parking)

    return query.distinct().all()


# ---------------- Advanced Search ----------------

@router.get("/search", response_model=list[HostelResponse])
def search_hostels(
    city: Optional[str] = None,
    area: Optional[str] = None,
    wifi: Optional[bool] = None,
    food: Optional[bool] = None,
    parking: Optional[bool] = None,
    laundry: Optional[bool] = None,
    ac: Optional[bool] = None,
    max_price: Optional[float] = None,
    sharing_type: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Hostel).outerjoin(Room)

    if city:
        query = query.filter(Hostel.city.ilike(f"%{city}%"))

    if area:
        query = query.filter(Hostel.area.ilike(f"%{area}%"))

    if wifi is not None:
        query = query.filter(Hostel.wifi == wifi)

    if food is not None:
        query = query.filter(Hostel.food == food)

    if parking is not None:
        query = query.filter(Hostel.parking == parking)

    if laundry is not None:
        query = query.filter(Hostel.laundry == laundry)

    if ac is not None:
        query = query.filter(Room.ac == ac)

    if max_price is not None:
        query = query.filter(Room.price <= max_price)

    if sharing_type:
        query = query.filter(Room.sharing_type.ilike(f"%{sharing_type}%"))

    hostels = (
        query.options(
            joinedload(Hostel.rooms),
            joinedload(Hostel.images)
        )
        .distinct()
        .all()
    )

    return hostels


# ---------------- Get Hostel By ID ----------------

@router.get("/{hostel_id}", response_model=HostelResponse)
def get_hostel_by_id(
    hostel_id: int,
    db: Session = Depends(get_db)
):
    hostel = (
        db.query(Hostel)
        .options(
            joinedload(Hostel.rooms),
            joinedload(Hostel.images)
        )
        .filter(Hostel.id == hostel_id)
        .first()
    )

    if hostel is None:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    return hostel


# ---------------- Update Hostel ----------------

@router.put("/{hostel_id}", response_model=HostelResponse)
def update_hostel(
    hostel_id: int,
    hostel_data: HostelUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    hostel = db.query(Hostel).filter(
        Hostel.id == hostel_id
    ).first()

    if hostel is None:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    if hostel.owner_id != current_user.id and current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="You can update only your own hostel."
        )

    hostel.hostel_name = hostel_data.hostel_name
    hostel.description = hostel_data.description
    hostel.city = hostel_data.city
    hostel.area = hostel_data.area
    hostel.address = hostel_data.address
    hostel.latitude = hostel_data.latitude
    hostel.longitude = hostel_data.longitude
    hostel.contact_number = hostel_data.contact_number
    hostel.email = hostel_data.email
    hostel.food = hostel_data.food
    hostel.wifi = hostel_data.wifi
    hostel.parking = hostel_data.parking
    hostel.laundry = hostel_data.laundry
    hostel.cctv = hostel_data.cctv
    hostel.power_backup = hostel_data.power_backup

    db.commit()
    db.refresh(hostel)

    return hostel


# ---------------- Delete Hostel ----------------

@router.delete("/{hostel_id}")
def delete_hostel(
    hostel_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    hostel = db.query(Hostel).filter(
        Hostel.id == hostel_id
    ).first()

    if hostel is None:
        raise HTTPException(
            status_code=404,
            detail="Hostel not found"
        )

    if hostel.owner_id != current_user.id and current_user.role.lower() != "admin":
        raise HTTPException(
            status_code=403,
            detail="You can delete only your own hostel."
        )

    db.delete(hostel)
    db.commit()

    return {
        "message": "Hostel deleted successfully."
    }
