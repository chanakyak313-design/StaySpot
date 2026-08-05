from fastapi import APIRouter, Depends, HTTPException, Response
from sqlalchemy.orm import Session

from app.database.database import get_db
from app.dependencies.auth import get_current_user

from app.models.user import User
from app.models.room import Room
from app.models.hostel import Hostel
from app.models.booking import Booking

from app.schemas.booking import BookingCreate, BookingResponse
from app.utils.receipt import generate_receipt_pdf
from app.utils.email import send_booking_confirmation_email

router = APIRouter(
    prefix="/bookings",
    tags=["Bookings"]
)


@router.post("/", response_model=BookingResponse)
def create_booking(
    booking: BookingCreate,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    room = db.query(Room).filter(Room.id == booking.room_id).first()

    if room is None:
        raise HTTPException(
            status_code=404,
            detail="Room not found"
        )

    if room.available_beds <= 0:
        raise HTTPException(
            status_code=400,
            detail="Room is full"
        )

    new_booking = Booking(
        user_id=current_user.id,
        room_id=booking.room_id,
        status="Confirmed"
    )

    room.available_beds -= 1

    db.add(new_booking)
    db.commit()
    db.refresh(new_booking)

    # Best-effort confirmation email - never blocks the booking response
    # if it fails (e.g. SMTP not configured yet).
    hostel = db.query(Hostel).filter(Hostel.id == room.hostel_id).first()
    if hostel:
        try:
            receipt_pdf = generate_receipt_pdf(
                new_booking, room, hostel.hostel_name, current_user.full_name, room.room_type
            )
            send_booking_confirmation_email(
                current_user.email, current_user.full_name, hostel.hostel_name, room.price, receipt_pdf
            )
        except Exception:
            pass

    return new_booking


# ---------------- My Bookings ----------------

@router.get("/my", response_model=list[BookingResponse])
def get_my_bookings(
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    bookings = db.query(Booking).filter(
        Booking.user_id == current_user.id
    ).all()

    return bookings


# ---------------- Cancel Booking ----------------

@router.delete("/{booking_id}")
def cancel_booking(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):

    booking = db.query(Booking).filter(
        Booking.id == booking_id
    ).first()

    if booking is None:
        raise HTTPException(
            status_code=404,
            detail="Booking not found"
        )

    if booking.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can cancel only your own booking."
        )

    room = db.query(Room).filter(
        Room.id == booking.room_id
    ).first()

    if room:
        room.available_beds += 1

    db.delete(booking)
    db.commit()

    return {
        "message": "Booking cancelled successfully."
    }


@router.get("/user/{user_id}")
def get_user_bookings(user_id: int, db: Session = Depends(get_db)):
    return (
        db.query(Booking)
        .filter(Booking.user_id == user_id)
        .all()
    )


# ---------------- Receipt ----------------

@router.get("/{booking_id}/receipt")
def download_booking_receipt(
    booking_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    booking = db.query(Booking).filter(Booking.id == booking_id).first()
    if booking is None:
        raise HTTPException(status_code=404, detail="Booking not found")

    if booking.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="You can only download your own receipts")

    room = db.query(Room).filter(Room.id == booking.room_id).first()
    hostel = db.query(Hostel).filter(Hostel.id == room.hostel_id).first() if room else None

    pdf_bytes = generate_receipt_pdf(
        booking,
        room,
        hostel.hostel_name if hostel else "-",
        current_user.full_name,
        room.room_type if room else "-",
    )

    return Response(
        content=pdf_bytes,
        media_type="application/pdf",
        headers={
            "Content-Disposition": f'attachment; filename="StaySpot_Receipt_{booking_id}.pdf"'
        },
    )
