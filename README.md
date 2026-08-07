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
- Reviews & ratings (hostel rating auto-recalculates as reviews come in)
- Booking confirmation emails (optional — skips gracefully if not configured)
- AI assistant with streaming responses, conversation memory, and
  natural-language search ("hostel near Gachibowli under 6k with AC")
- Owner dashboard with occupancy & revenue stats
- Admin panel for managing users and listings

## Tech Stack

**Backend:** FastAPI, SQLAlchemy, PostgreSQL, JWT, Pydantic, Google Gemini
**Frontend:** React, Vite, Tailwind CSS, React Router, Leaflet

## Project Structure

```
StaySpot/
├── backend/     FastAPI application
└── frontend/    React (Vite) application
```

## Local Setup

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
npm run dev
```

No `.env` needed for local dev — maps run on free OpenStreetMap tiles,
and the API defaults to `http://127.0.0.1:8000`.

## Demo Data

To make the app look alive for a demo instead of showing empty states
everywhere, seed it with realistic sample content:

```bash
cd backend
python seed.py
```

This creates 6 hostels across 5 cities (with photos, rooms, reviews,
and map pins) plus three ready-to-use demo accounts:

| Role    | Email                  | Password   |
|---------|-------------------------|------------|
| Student | student@stayspot.demo  | demo1234   |
| Owner   | owner@stayspot.demo    | demo1234   |
| Admin   | admin@stayspot.demo    | demo1234   |

Safe to re-run — it skips seeding if demo data is already present.

## Deploying Live

**Frontend (Vercel or Netlify):**
1. Connect the `frontend/` folder as the project root
2. Build command: `npm run build`, output directory: `dist`
3. Set env var `VITE_API_URL` to your deployed backend's URL
4. SPA routing is already handled (`vercel.json` / `public/_redirects`
   are included, so deep links like `/hostel/5` won't 404 on refresh)

**Backend (Render or Railway):**
1. Root directory: `backend/`
2. Build command: `pip install -r requirements.txt`
3. Start command: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   (a `Procfile` with this is already included)
4. Set the same env vars from `.env` in your host's dashboard
   (`DATABASE_URL`, `GEMINI_API_KEY`, etc.)

**Database:** any hosted Postgres works (Neon, Supabase, and Render's
own Postgres all have free tiers). Point `DATABASE_URL` at it — tables
are created automatically on first startup.

Once both are live, you can run `seed.py` locally pointed at the
production `DATABASE_URL` to populate the live demo with the same
sample content.

## Notes

- No payment gateway is wired up — bookings confirm instantly.
- AI features degrade gracefully if `GEMINI_API_KEY` is missing or the
  Gemini API is temporarily unavailable.
- CORS is open (`allow_origins=["*"]`) since auth uses a Bearer token,
  not cookies — safe for this app's design, no changes needed for
  production.
