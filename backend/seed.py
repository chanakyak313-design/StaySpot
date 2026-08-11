"""
Seeds the database with realistic demo content so the app looks alive
the moment you open it, instead of showing empty states everywhere.

Usage (from the backend/ folder, with your venv active):
    python seed.py

Safe to re-run: it checks for existing demo data first and skips
seeding if the demo owner account already exists.
"""

import sys
from datetime import datetime, timedelta, timezone

sys.path.insert(0, ".")

from app.database.database import Base, engine, SessionLocal
from app.models.user import User
from app.models.hostel import Hostel
from app.models.room import Room
from app.models.hostel_image import HostelImage
from app.models.review import Review
from app.models.favorite import Favorite
from app.models.booking import Booking
from app.services.user_service import hash_password

DEMO_PASSWORD = "demo1234"

USERS = [
    {"full_name": "Ananya Rao", "email": "student@stayspot.demo", "phone": "9000000001", "role": "student"},
    {"full_name": "Vikram Hostels Pvt Ltd", "email": "owner@stayspot.demo", "phone": "9000000002", "role": "owner"},
    {"full_name": "StaySpot Admin", "email": "admin@stayspot.demo", "phone": "9000000003", "role": "admin"},
]

REVIEWERS = [
    "Priya Sharma", "Rahul Verma", "Sneha Iyer", "Arjun Nair", "Divya Menon",
    "Karan Malhotra", "Neha Gupta", "Aditya Kumar", "Pooja Reddy", "Rohan Joshi",
]


def photo(seed: str) -> str:
    return f"https://picsum.photos/seed/{seed}/900/600"


HOSTELS = [
    {
        "hostel_name": "Sunrise Nest PG",
        "description": "A bright, well-kept PG five minutes from Gachibowli tech park. Home-style food, fast WiFi, and a genuinely helpful warden.",
        "city": "Hyderabad", "area": "Gachibowli", "address": "Plot 12, Nanakramguda Rd, Gachibowli",
        "latitude": 17.4401, "longitude": 78.3489,
        "contact_number": "9812340001", "email": "sunrise.nest@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 1, "price": 9500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 1, "price": 6500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 3, "available_beds": 3, "price": 5200, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("sunrise1"), photo("sunrise2"), photo("sunrise3")],
        "reviews": [
            (5, "Genuinely one of the best PGs I've stayed at. Food is home-style and the warden actually cares."),
            (4, "Great location, close to everything. WiFi drops occasionally but overall solid."),
            (5, "Been here 8 months, never had a serious complaint. Highly recommend for Gachibowli commuters."),
        ],
    },
    {
        "hostel_name": "Koramangala Coliving",
        "description": "Modern coliving space for students and young professionals. Fully furnished, high-speed internet, rooftop lounge.",
        "city": "Bangalore", "area": "Koramangala", "address": "5th Block, 80 Feet Rd, Koramangala",
        "latitude": 12.9352, "longitude": 77.6146,
        "contact_number": "9812340002", "email": "koramangala.coliving@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 0, "price": 14000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 2, "price": 9000, "ac": True, "attached_bathroom": True},
        ],
        "images": [photo("kora1"), photo("kora2"), photo("kora3")],
        "reviews": [
            (5, "Feels more like a serviced apartment than a hostel. Rooftop is a huge plus."),
            (5, "Pricey but worth it if you want privacy and reliable WiFi for online classes."),
            (3, "Good place but parking is a real problem in the area."),
            (4, "Clean, modern, and the community events on the rooftop are a nice touch."),
        ],
    },
    {
        "hostel_name": "Riverside Boys Hostel",
        "description": "Budget-friendly hostel for students, walking distance from Pune University. Simple, clean, no frills.",
        "city": "Pune", "area": "Shivajinagar", "address": "Near FC Road, Shivajinagar",
        "latitude": 18.5308, "longitude": 73.8478,
        "contact_number": "9812340003", "email": "riverside.boys@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": False, "cctv": False, "power_backup": False,
        "rooms": [
            {"room_type": "Dormitory", "sharing_type": "Four", "total_beds": 4, "available_beds": 2, "price": 4200, "ac": False, "attached_bathroom": False},
            {"room_type": "Dormitory", "sharing_type": "Six", "total_beds": 6, "available_beds": 4, "price": 3500, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("river1"), photo("river2")],
        "reviews": [
            (4, "Does the job. Cheap, close to campus, food is basic but edible."),
            (3, "No frills as advertised - fine if you just need a bed and don't expect luxury."),
        ],
    },
    {
        "hostel_name": "Anna Nagar Girls PG",
        "description": "Safe, secure PG exclusively for women, with 24/7 CCTV and a strict but fair warden. Close to Anna University.",
        "city": "Chennai", "area": "Anna Nagar", "address": "2nd Avenue, Anna Nagar West",
        "latitude": 13.0850, "longitude": 80.2101,
        "contact_number": "9812340004", "email": "annanagar.girlspg@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 1, "price": 7500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 3, "available_beds": 0, "price": 5800, "ac": False, "attached_bathroom": True},
        ],
        "images": [photo("anna1"), photo("anna2"), photo("anna3")],
        "reviews": [
            (5, "Extremely safe, my parents were worried but this place changed their mind."),
            (4, "Food could be better but safety and cleanliness make up for it."),
            (5, "Warden is strict about timings but honestly that's a good thing for a girls PG."),
        ],
    },
    {
        "hostel_name": "Andheri Student Stay",
        "description": "Compact, well-connected hostel near Andheri station. Great for students commuting across the city.",
        "city": "Mumbai", "area": "Andheri East", "address": "Near Metro Station, Andheri East",
        "latitude": 19.1197, "longitude": 72.8697,
        "contact_number": "9812340005", "email": "andheri.stay@stayspot.demo",
        "food": False, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 1, "price": 11000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 2, "price": 7200, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("andheri1"), photo("andheri2")],
        "reviews": [
            (4, "Super convenient if you're commuting by metro every day. Rooms are small though."),
            (4, "No food included but there are great local spots right outside."),
        ],
    },
    {
        "hostel_name": "Green Valley PG",
        "description": "Newly opened PG with a quiet, green campus feel. A bit further from the city center but peaceful.",
        "city": "Hyderabad", "area": "Kondapur", "address": "Botanical Garden Rd, Kondapur",
        "latitude": 17.4615, "longitude": 78.3595,
        "contact_number": "9812340006", "email": "greenvalley.pg@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": False, "power_backup": False,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 2, "price": 6000, "ac": False, "attached_bathroom": True},
        ],
        "images": [photo("green1"), photo("green2")],
        "reviews": [
            (4, "Quiet and peaceful, good if you want to focus on studies away from city noise."),
        ],
    },
    {
        "hostel_name": "Saket Scholars Hostel",
        "description": "Long-established hostel near Saket, popular with civil services aspirants. Reading room and mess included.",
        "city": "Delhi", "area": "Saket", "address": "MB Road, Saket",
        "latitude": 28.5245, "longitude": 77.2066,
        "contact_number": "9812340007", "email": "saket.scholars@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 1, "price": 8000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 3, "available_beds": 2, "price": 6200, "ac": False, "attached_bathroom": False},
            {"room_type": "Dormitory", "sharing_type": "Four", "total_beds": 4, "available_beds": 0, "price": 4800, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("saket1"), photo("saket2"), photo("saket3")],
        "reviews": [
            (5, "The reading room alone is worth it. Very quiet, disciplined environment for serious prep."),
            (5, "Been here two years for UPSC prep. Mess food is consistent and the staff respect study schedules."),
            (4, "Great for focus, though it can feel a bit strict on visitor rules."),
        ],
    },
    {
        "hostel_name": "Salt Lake Residency",
        "description": "Comfortable hostel in Salt Lake, close to tech parks and well connected by metro.",
        "city": "Kolkata", "area": "Salt Lake", "address": "Sector V, Salt Lake City",
        "latitude": 22.5744, "longitude": 88.4338,
        "contact_number": "9812340008", "email": "saltlake.residency@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 1, "price": 8500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 1, "price": 5800, "ac": False, "attached_bathroom": True},
        ],
        "images": [photo("salt1"), photo("salt2")],
        "reviews": [
            (5, "Well maintained and the metro connectivity makes commuting to Sector V effortless."),
            (4, "Solid choice for IT park employees and students alike."),
        ],
    },
    {
        "hostel_name": "HITEC City Executive PG",
        "description": "Premium PG catering to working professionals and postgrad students near HITEC City.",
        "city": "Hyderabad", "area": "HITEC City", "address": "Cyber Towers Rd, HITEC City",
        "latitude": 17.4483, "longitude": 78.3915,
        "contact_number": "9812340009", "email": "hitec.executive@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 2, "price": 13500, "ac": True, "attached_bathroom": True},
        ],
        "images": [photo("hitec1"), photo("hitec2"), photo("hitec3")],
        "reviews": [
            (5, "Top-tier for the price. Feels like a mini studio apartment, not a typical PG."),
            (5, "Housekeeping daily, fast WiFi, and genuinely quiet at night. Worth the premium."),
            (4, "Excellent facilities, only downside is it's a bit far from the metro."),
        ],
    },
    {
        "hostel_name": "Whitefield Tech Hostel",
        "description": "Modern hostel built for the Whitefield IT crowd - coworking-style common areas and blazing fast WiFi.",
        "city": "Bangalore", "area": "Whitefield", "address": "ITPL Main Road, Whitefield",
        "latitude": 12.9698, "longitude": 77.7500,
        "contact_number": "9812340010", "email": "whitefield.tech@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 1, "available_beds": 1, "price": 12500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 2, "price": 8200, "ac": True, "attached_bathroom": True},
        ],
        "images": [photo("white1"), photo("white2")],
        "reviews": [
            (4, "Common area doubles as a great workspace, WiFi genuinely never drops."),
            (5, "Best hostel I've lived in near Whitefield, hands down."),
        ],
    },
    {
        "hostel_name": "FC Road Girls Hostel",
        "description": "Well-known girls hostel on FC Road, walking distance from multiple Pune colleges.",
        "city": "Pune", "area": "FC Road", "address": "Fergusson College Road",
        "latitude": 18.5236, "longitude": 73.8410,
        "contact_number": "9812340011", "email": "fcroad.girls@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": False,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 3, "available_beds": 1, "price": 5500, "ac": False, "attached_bathroom": True},
            {"room_type": "Dormitory", "sharing_type": "Six", "total_beds": 6, "available_beds": 3, "price": 4000, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("fc1"), photo("fc2")],
        "reviews": [
            (5, "Can't beat the location - roll out of bed and you're basically on campus."),
            (4, "A bit noisy given how central it is, but that's the tradeoff for the location."),
            (5, "Warden aunty is like a second mother here, genuinely caring staff."),
        ],
    },
    {
        "hostel_name": "T Nagar Comfort Stay",
        "description": "Centrally located hostel in T Nagar with easy access to shopping, food, and public transport.",
        "city": "Chennai", "area": "T Nagar", "address": "Usman Road, T Nagar",
        "latitude": 13.0418, "longitude": 80.2341,
        "contact_number": "9812340012", "email": "tnagar.comfort@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 2, "available_beds": 2, "price": 6800, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 3, "available_beds": 1, "price": 5200, "ac": False, "attached_bathroom": False},
        ],
        "images": [photo("tnagar1"), photo("tnagar2")],
        "reviews": [
            (4, "Great if you want to be in the middle of everything - shopping, food, transit."),
        ],
    },
]


def run():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        existing = db.query(User).filter(User.email == "owner@stayspot.demo").first()
        if existing:
            print("Demo data already present (owner@stayspot.demo exists) - skipping.")
            print("Delete these rows yourself first if you want to reseed from scratch.")
            return

        print("Seeding demo users...")
        users_by_role = {}
        for u in USERS:
            user = User(
                full_name=u["full_name"],
                email=u["email"],
                phone=u["phone"],
                password=hash_password(DEMO_PASSWORD),
                role=u["role"],
            )
            db.add(user)
            db.flush()
            users_by_role[u["role"]] = user

        owner = users_by_role["owner"]
        student = users_by_role["student"]

        print("Seeding reviewer accounts (for varied, realistic testimonials)...")
        reviewer_users = []
        for i, name in enumerate(REVIEWERS):
            reviewer = User(
                full_name=name,
                email=f"reviewer{i}@stayspot.demo",
                phone=f"90000010{i:02d}",
                password=hash_password(DEMO_PASSWORD),
                role="student",
            )
            db.add(reviewer)
            db.flush()
            reviewer_users.append(reviewer)

        print(f"Seeding {len(HOSTELS)} hostels, rooms, photos, and reviews...")
        all_rooms = []
        for hostel_index, h in enumerate(HOSTELS):
            hostel = Hostel(
                owner_id=owner.id,
                hostel_name=h["hostel_name"],
                description=h["description"],
                city=h["city"],
                area=h["area"],
                address=h["address"],
                latitude=h["latitude"],
                longitude=h["longitude"],
                contact_number=h["contact_number"],
                email=h["email"],
                food=h["food"],
                wifi=h["wifi"],
                parking=h["parking"],
                laundry=h["laundry"],
                cctv=h["cctv"],
                power_backup=h["power_backup"],
            )
            db.add(hostel)
            db.flush()

            for r in h["rooms"]:
                room = Room(hostel_id=hostel.id, **r)
                db.add(room)
                db.flush()
                all_rooms.append(room)

            for url in h["images"]:
                db.add(HostelImage(hostel_id=hostel.id, image_url=url))

            ratings = []
            for i, (rating, comment) in enumerate(h["reviews"]):
                reviewer = reviewer_users[(i + hostel_index * 3) % len(reviewer_users)]
                db.add(Review(
                    user_id=reviewer.id,
                    hostel_id=hostel.id,
                    rating=rating,
                    review=comment,
                ))
                ratings.append(rating)

            hostel.rating = round(sum(ratings) / len(ratings), 1) if ratings else 0.0

        db.flush()

        print("Seeding a sample booking and favorites for the demo student...")
        if all_rooms:
            db.add(Booking(
                user_id=student.id,
                room_id=all_rooms[0].id,
                status="Confirmed",
                booking_date=datetime.now(timezone.utc) - timedelta(days=3),
            ))

        seeded_hostels = db.query(Hostel).limit(4).all()
        for hostel in seeded_hostels:
            db.add(Favorite(user_id=student.id, hostel_id=hostel.id))

        db.commit()

        total_reviews = sum(len(h["reviews"]) for h in HOSTELS)
        cities = sorted(set(h["city"] for h in HOSTELS))

        print()
        print("=" * 60)
        print("Demo data seeded successfully!")
        print("=" * 60)
        print()
        print("Demo login credentials (password is the same for all):")
        print(f"  Student : student@stayspot.demo / {DEMO_PASSWORD}")
        print(f"  Owner   : owner@stayspot.demo   / {DEMO_PASSWORD}")
        print(f"  Admin   : admin@stayspot.demo   / {DEMO_PASSWORD}")
        print()
        print(f"Seeded {len(HOSTELS)} hostels, {total_reviews} reviews, across {len(cities)} cities:")
        print(f"  {', '.join(cities)}")

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    run()
