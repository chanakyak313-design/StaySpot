from pydantic import BaseModel, EmailStr


class UserCreate(BaseModel):
    full_name: str
    email: EmailStr
    phone: str
    password: str
    role: str


class UserResponse(BaseModel):
    id: int
    full_name: str
    email: EmailStr
    phone: str
    role: str

    class Config:
        from_attributes = True


class UserLogin(BaseModel):
    email: EmailStr
    password: str

    class Config:
        from_attributes = True
class UserUpdate(BaseModel):
    full_name: str
    phone: str
    email: EmailStr

    class Config:
        from_attributes = True

