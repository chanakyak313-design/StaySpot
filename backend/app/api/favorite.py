from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.favorite import Favorite

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

    favorite = Favorite(
        user_id=user_id,
        hostel_id=hostel_id
    )

    db.add(favorite)
    db.commit()
    db.refresh(favorite)

    return favorite


@router.get("/{user_id}")
def get_favorites(
    user_id: int,
    db: Session = Depends(get_db)
):

    return (
        db.query(Favorite)
        .filter(Favorite.user_id == user_id)
        .all()
    )


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