from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserResponse, UserUpdate
from app.dependencies.auth import get_current_user

router = APIRouter(
    prefix="/profile",
    tags=["Profile"]
)


@router.get("/{user_id}", response_model=UserResponse)
def get_profile(user_id: int, db: Session = Depends(get_db)):

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    return user


@router.put("/{user_id}", response_model=UserResponse)
def update_profile(
    user_id: int,
    updated: UserUpdate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if current_user.id != user_id:
        raise HTTPException(403, "You can only update your own profile.")

    user = db.query(User).filter(
        User.id == user_id
    ).first()

    if not user:
        raise HTTPException(404, "User not found")

    for key, value in updated.model_dump().items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user