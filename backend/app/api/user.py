from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.models.user import User
from app.schemas.user import UserCreate, UserResponse
from app.services.user_service import hash_password, verify_password
from app.core.security import create_access_token
from app.dependencies.auth import get_current_user

router = APIRouter(prefix="/users", tags=["Users"])


# ---------------- Register ----------------

@router.post("/register", response_model=UserResponse)
def register_user(user: UserCreate, db: Session = Depends(get_db)):

    existing_email = db.query(User).filter(User.email == user.email).first()
    if existing_email:
        raise HTTPException(
            status_code=400,
            detail="Email already exists"
        )

    existing_phone = db.query(User).filter(User.phone == user.phone).first()
    if existing_phone:
        raise HTTPException(
            status_code=400,
            detail="Phone number already exists"
        )

    new_user = User(
        full_name=user.full_name,
        email=user.email,
        phone=user.phone,
        password=hash_password(user.password),
        role=user.role
    )

    db.add(new_user)
    db.commit()
    db.refresh(new_user)

    return new_user


# ---------------- Login (Swagger Compatible) ----------------

@router.post("/login")
def login_user(
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):

    db_user = db.query(User).filter(
        User.email == form_data.username
    ).first()

    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not verify_password(form_data.password, db_user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    access_token = create_access_token(
        data={
            "sub": db_user.email,
            "role": db_user.role
        }
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }


# ---------------- Current User ----------------

@router.get("/me", response_model=UserResponse)
def get_me(current_user: User = Depends(get_current_user)):
    return current_user