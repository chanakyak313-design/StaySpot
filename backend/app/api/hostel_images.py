from fastapi import APIRouter, UploadFile, File, Depends, HTTPException
from sqlalchemy.orm import Session

import cloudinary.uploader
import app.core.cloudinary  # noqa: F401 - configures the Cloudinary SDK on import

from app.database.database import get_db
from app.dependencies.auth import get_current_user
from app.models.user import User
from app.models.hostel import Hostel
from app.models.hostel_image import HostelImage

router = APIRouter(
    prefix="/hostel-images",
    tags=["Hostel Images"]
)


@router.post("/{hostel_id}")
async def upload_hostel_image(
    hostel_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    hostel = db.query(Hostel).filter(Hostel.id == hostel_id).first()

    if hostel is None:
        raise HTTPException(status_code=404, detail="Hostel not found")

    if hostel.owner_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can upload images only for your own hostel."
        )

    result = cloudinary.uploader.upload(file.file)

    image = HostelImage(
        hostel_id=hostel_id,
        image_url=result["secure_url"]
    )

    db.add(image)
    db.commit()
    db.refresh(image)

    return image
