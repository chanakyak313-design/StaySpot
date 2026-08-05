# StaySpot

AI-powered hostel discovery and booking platform for students — verified
listings, real-time availability, map-based search, and an AI assistant
to help find the right fit.

## Features

- JWT authentication with role-based access (student / owner / admin)
- Hostel & room CRUD with photo uploads (Cloudinary)
- Search & filter by city, budget, amenities, sharing type
- Map-based search and location picking (Leaflet / OpenStreetMap — free, no API key)
- Instant booking, cancellation, and PDF receipts
- Reviews & ratings
- Booking confirmation emails (optional — skips gracefully if not configured)
- AI recommendation assistant (Google Gemini)
- Owner dashboard with occupancy & revenue stats
- Admin panel for managing users and listings

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT, Pydantic
**Frontend:** React, Vite, Tailwind CSS, React Router, Leaflet

## Project Structure

```
StaySpot/
├── backend/     FastAPI application
└── frontend/    React (Vite) application
```

## Setup

### 1. Database

Create a PostgreSQL database — no manual table setup needed, the app
creates its own tables on first run.

```sql
CREATE DATABASE stayspot_db;
```

### 2. Backend

```bash
cd backend
python -m venv venv
venv\Scripts\activate        # Windows
# source venv/bin/activate   # macOS/Linux
pip install -r requirements.txt
```

Copy `.env.example` to `.env` and fill in your values:

```bash
cp .env.example .env
```

Required: `DATABASE_URL`. Optional: `GEMINI_API_KEY` (AI features),
`SMTP_*` (booking confirmation emails — safely skipped if left blank).

Run it:

```bash
uvicorn app.main:app --reload
```

### 3. Frontend

```bash
cd frontend
npm install
```

No `.env` needed — maps run on free OpenStreetMap tiles, no API key required.

Run it:

```bash
npm run dev
```

## Notes

- No payment gateway is wired up — bookings confirm instantly.
- AI features degrade gracefully if `GEMINI_API_KEY` is missing or the
  Gemini API is temporarily unavailable.
