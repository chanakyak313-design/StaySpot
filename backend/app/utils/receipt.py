import io
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.lib.units import mm
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle


def generate_receipt_pdf(booking, room, hostel_name: str, user_name: str, room_type: str) -> bytes:
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(buffer, pagesize=A4, topMargin=30 * mm)

    styles = getSampleStyleSheet()
    title_style = ParagraphStyle(
        "Title", parent=styles["Heading1"], textColor=colors.HexColor("#2563eb")
    )

    elements = []
    elements.append(Paragraph("StaySpot", title_style))
    elements.append(Paragraph("Booking Confirmation", styles["Heading2"]))
    elements.append(Spacer(1, 12))

    price = room.price if room else None

    data = [
        ["Receipt No.", f"RCPT-{booking.id:06d}"],
        ["Date", booking.booking_date.strftime("%d %b %Y, %I:%M %p") if booking.booking_date else "-"],
        ["Booking ID", str(booking.id)],
        ["Guest Name", user_name],
        ["Hostel", hostel_name],
        ["Room Type", room_type],
        ["Status", booking.status],
        ["Monthly Rent", f"Rs. {price:,.2f}" if price is not None else "-"],
    ]

    table = Table(data, colWidths=[150, 300])
    table.setStyle(
        TableStyle(
            [
                ("BACKGROUND", (0, 0), (0, -1), colors.HexColor("#eff6ff")),
                ("TEXTCOLOR", (0, 0), (0, -1), colors.HexColor("#1e3a8a")),
                ("FONTNAME", (0, 0), (0, -1), "Helvetica-Bold"),
                ("FONTNAME", (1, 0), (1, -1), "Helvetica"),
                ("GRID", (0, 0), (-1, -1), 0.5, colors.HexColor("#d1d5db")),
                ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
                ("TOPPADDING", (0, 0), (-1, -1), 8),
                ("BOTTOMPADDING", (0, 0), (-1, -1), 8),
                ("LEFTPADDING", (0, 0), (-1, -1), 10),
            ]
        )
    )

    elements.append(table)
    elements.append(Spacer(1, 24))
    elements.append(
        Paragraph(
            "Thank you for booking with StaySpot. This is a system-generated receipt.",
            styles["Normal"],
        )
    )

    doc.build(elements)
    buffer.seek(0)
    return buffer.read()
