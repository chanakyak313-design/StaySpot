from pydantic import BaseModel


class FavoriteCreate(BaseModel):
    hostel_id: int


class FavoriteResponse(BaseModel):
    id: int
    user_id: int
    hostel_id: int

    class Config:
        from_attributes = True