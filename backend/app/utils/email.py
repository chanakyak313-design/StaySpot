import os
import smtplib
import logging
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.application import MIMEApplication

logger = logging.getLogger("stayspot.email")


def _smtp_configured() -> bool:
    return bool(
        os.getenv("SMTP_HOST")
        and os.getenv("SMTP_USER")
        and os.getenv("SMTP_PASSWORD")
    )


def send_email(to_email: str, subject: str, body_html: str, attachment: bytes | None = None, attachment_name: str = "receipt.pdf"):
    """
    Sends an email via SMTP. If SMTP credentials aren't configured in the
    environment, this silently no-ops (logging a warning) instead of
    crashing the request that triggered it - e.g. a booking confirmation
    should never fail just because email isn't set up yet.
    """
    if not _smtp_configured():
        logger.warning(
            "SMTP not configured (SMTP_HOST/SMTP_USER/SMTP_PASSWORD missing in .env) "
            "- skipping email to %s: %s",
            to_email,
            subject,
        )
        return False

    smtp_host = os.getenv("SMTP_HOST")
    smtp_port = int(os.getenv("SMTP_PORT", "587"))
    smtp_user = os.getenv("SMTP_USER")
    smtp_password = os.getenv("SMTP_PASSWORD")
    from_email = os.getenv("FROM_EMAIL", smtp_user)

    msg = MIMEMultipart()
    msg["From"] = from_email
    msg["To"] = to_email
    msg["Subject"] = subject
    msg.attach(MIMEText(body_html, "html"))

    if attachment:
        part = MIMEApplication(attachment, Name=attachment_name)
        part["Content-Disposition"] = f'attachment; filename="{attachment_name}"'
        msg.attach(part)

    try:
        with smtplib.SMTP(smtp_host, smtp_port) as server:
            server.starttls()
            server.login(smtp_user, smtp_password)
            server.sendmail(from_email, to_email, msg.as_string())
        return True
    except Exception:
        logger.exception("Failed to send email to %s", to_email)
        return False


def send_booking_confirmation_email(to_email: str, full_name: str, hostel_name: str, amount: float, receipt_pdf: bytes | None = None):
    subject = f"Booking Confirmed - {hostel_name}"
    body = f"""
    <div style="font-family: sans-serif; max-width: 500px; margin: auto;">
      <h2 style="color:#2563eb;">Booking Confirmed 🎉</h2>
      <p>Hi {full_name},</p>
      <p>Your booking at <strong>{hostel_name}</strong> has been confirmed and payment
      of <strong>₹{amount}</strong> was received successfully.</p>
      <p>Your receipt is attached to this email.</p>
      <p>Thank you for choosing StaySpot!</p>
    </div>
    """
    return send_email(to_email, subject, body, attachment=receipt_pdf, attachment_name="StaySpot_Receipt.pdf")
