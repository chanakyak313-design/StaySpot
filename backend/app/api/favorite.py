from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.favorite import Favorite
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.hostel_image import HostelImage

router = APIRouter(
    prefix="/favorites",
    tags=["Favorites"]
)


@router.post("/")
def add_favorite(
    user_id: int,
    hostel_id: int,
    db: Session = Depends(get_db)
):
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()
    if not hostel:
        raise HTTPException(status_code=404, detail="Hostel not found")

    existing = db.query(Favorite).filter(
        Favorite.user_id == user_id,
        Favorite.hostel_id == hostel_id
    ).first()

    if existing:
        return {"id": existing.id, "user_id": existing.user_id, "hostel_id": existing.hostel_id, "message": "Already in favorites"}

    favorite = Favorite(
        user_id=user_id,
        hostel_id=hostel_id
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return {"id": favorite.id, "user_id": favorite.user_id, "hostel_id": favorite.hostel_id}


@router.get("/{user_id}")
def get_favorites(
    user_id: int,
    db: Session = Depends(get_db)
):
    favorites = (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .order_by(Favorite.id.desc())
        .all()
    )

    results = []
    for fav in favorites:
        hostel = db.query(Hostel).filter(Hostel.id == fav.hostel_id).first()
        if not hostel:
            continue
        rooms = db.query(Room).filter(Room.hostel_id == hostel.id).all()
        images = db.query(HostelImage).filter(HostelImage.hostel_id == hostel.id).all()

        results.append({
            "id": fav.id,
            "user_id": fav.user_id,
            "hostel_id": fav.hostel_id,
            "hostel": {
                "id": hostel.id,
                "hostel_name": hostel.hostel_name,
                "city": hostel.city,
                "area": hostel.area,
                "address": hostel.address,
                "rating": hostel.rating,
                "wifi": hostel.wifi,
                "food": hostel.food,
                "parking": hostel.parking,
                "laundry": hostel.laundry,
                "rooms": [{"id": r.id, "price": r.price, "room_type": r.room_type, "sharing_type": r.sharing_type, "available_beds": r.available_beds} for r in rooms],
                "images": [{"id": img.id, "image_url": img.image_url} for img in images],
            }
        })

    return results


@router.delete("/{favorite_id}")
def delete_favorite(
    favorite_id: int,
    db: Session = Depends(get_db)
):
    favorite = (
        db.query(Favorite)
        .filter(Favorite.id == favorite_id)
        .first()
    )

    if favorite:
        db.delete(favorite)
        db.commit()

    return {"message": "Favorite removed"}
