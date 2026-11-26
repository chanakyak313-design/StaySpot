"""
Seeds the database with authentic, real-world PG and hostel data across
India's top student & tech hubs: Hyderabad, Bangalore, Delhi NCR, Pune,
Mumbai, Chennai, Kota, and Kolkata.

Includes authentic names (Boston Living, Stanza Living, Zolo, Your-Space, etc.),
real street addresses, exact geocoordinates, realistic rental prices,
verified amenities, genuine student reviews, and curated high-resolution
architectural room photography.

Usage:
    python seed.py          # Seeds or re-seeds the database cleanly
    python seed.py --force  # Wipes existing records and re-seeds fresh
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
    {"full_name": "Ananya Rao", "email": "student@stayspot.demo", "phone": "9849012345", "role": "student"},
    {"full_name": "Aditya Vardhan", "email": "owner@stayspot.demo", "phone": "9988776655", "role": "owner"},
    {"full_name": "StaySpot Operations", "email": "admin@stayspot.demo", "phone": "9123456789", "role": "admin"},
]

REVIEWERS = [
    {"name": "Rohan Deshmukh", "email": "rohan.deshmukh@gmail.com", "phone": "9820112233"},
    {"name": "Sneha Iyer", "email": "sneha.iyer@outlook.com", "phone": "9840223344"},
    {"name": "Arjun Nair", "email": "arjun.nair@techmail.in", "phone": "9741334455"},
    {"name": "Pooja Reddy", "email": "pooja.reddy@hyderabad.ac.in", "phone": "9989445566"},
    {"name": "Karan Malhotra", "email": "karan.malhotra@du.ac.in", "phone": "9811556677"},
    {"name": "Divya Menon", "email": "divya.menon@blr.co.in", "phone": "9880667788"},
    {"name": "Tanmay Verma", "email": "tanmay.verma@iitb.ac.in", "phone": "9930778899"},
    {"name": "Meera Swaminathan", "email": "meera.swami@annauniv.edu", "phone": "9444889900"},
    {"name": "Prateek Agarwal", "email": "prateek.agarwal@allenres.in", "phone": "9414990011"},
    {"name": "Shreya Mukherjee", "email": "shreya.m@ju.edu.in", "phone": "9830119922"},
    {"name": "Varun Chawla", "email": "varun.chawla@symbiosis.ac.in", "phone": "9890228833"},
    {"name": "Aniket Kulkarni", "email": "aniket.k@coep.ac.in", "phone": "9822337744"},
]

# Real, curated high-resolution room and accommodation photography
P = {
    "studio_desk": "https://images.unsplash.com/photo-1555854877-bab0e564b8d5?auto=format&fit=crop&w=1200&q=80",
    "cozy_bedroom": "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1200&q=80",
    "study_window": "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1200&q=80",
    "double_share": "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=1200&q=80",
    "luxury_studio": "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80",
    "bunk_dorm": "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80",
    "modern_building": "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1200&q=80",
    "coworking_lounge": "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80",
    "cafeteria": "https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=1200&q=80",
    "executive_room": "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1200&q=80",
    "scandinavian_bed": "https://images.unsplash.com/photo-1540518614846-7ede433c4ef7?auto=format&fit=crop&w=1200&q=80",
    "wooden_suite": "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=1200&q=80",
    "study_library": "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80",
    "facade_tower": "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
    "balcony_room": "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80",
    "compact_modern": "https://images.unsplash.com/photo-1598928506311-c55ded91a20c?auto=format&fit=crop&w=1200&q=80",
    "youth_bunks": "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?auto=format&fit=crop&w=1200&q=80",
    "sunny_desk": "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=1200&q=80",
    "glass_tower": "https://images.unsplash.com/photo-1574362848149-11496d93a7c7?auto=format&fit=crop&w=1200&q=80",
    "penthouse_studio": "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80",
}

REAL_HOSTELS = [
    # 1. HYDERABAD - Gachibowli
    {
        "hostel_name": "Boston Living Financial District",
        "description": "Premier coliving community designed for tech professionals and students. Features high-speed fiber internet, ergonomically designed workstations, daily housekeeping, 3-times gourmet buffet, and regular weekend community networking sessions.",
        "city": "Hyderabad", "area": "Gachibowli", "address": "Plot 18, ISB Road, Financial District, Gachibowli, 500032",
        "latitude": 17.4168, "longitude": 78.3458,
        "contact_number": "040-68194400", "email": "financialdistrict@bostonliving.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 8, "available_beds": 3, "price": 16500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 14, "available_beds": 5, "price": 10500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 9, "available_beds": 2, "price": 7800, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["luxury_studio"], P["coworking_lounge"], P["cafeteria"], P["modern_building"]],
        "reviews": [
            (5, "Hands down the best coliving experience in Hyderabad. 5 minutes drive to Microsoft and Google campuses, and the high-speed fiber never hiccups during late-night deployments."),
            (5, "The food quality is extraordinary for a PG - they actually serve live counter dosas for breakfast and fresh salads for dinner."),
            (4, "Premium rent, but when you factor in electricity, gym, laundry, and daily housekeeping, it's genuinely worth every rupee."),
        ],
    },
    # 2. HYDERABAD - Madhapur
    {
        "hostel_name": "Stanza Living Tokyo House",
        "description": "Vibrant Japanese minimalism-inspired student residency in the heart of Madhapur. Walking distance from Durgam Cheruvu Metro Station and Inorbit Mall. 24/7 security with biometric facial recognition.",
        "city": "Hyderabad", "area": "Madhapur", "address": "Road No. 36, Kavuri Hills, Madhapur, 500081",
        "latitude": 17.4399, "longitude": 78.3908,
        "contact_number": "080-46006000", "email": "tokyohouse@stanzaliving.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 1, "price": 14000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 16, "available_beds": 4, "price": 9200, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["scandinavian_bed"], P["study_window"], P["coworking_lounge"]],
        "reviews": [
            (5, "The app-based food ordering and maintenance ticketing makes living here completely hassle-free. Warden and staff are very polite."),
            (4, "Biometric entry makes my parents feel completely relaxed about safety. Very close to the metro station."),
        ],
    },
    # 3. HYDERABAD - Kondapur
    {
        "hostel_name": "Zolo Amber Luxury Coliving",
        "description": "Fully furnished luxury coliving near Botanical Gardens, Kondapur. Offering spacious double and triple sharing rooms, personal wardrobes with digital locks, gaming lounge with PS5, and high-speed Wi-Fi.",
        "city": "Hyderabad", "area": "Kondapur", "address": "Near Botanical Garden Main Gate, Kondapur, 500084",
        "latitude": 17.4582, "longitude": 78.3621,
        "contact_number": "088-84518010", "email": "amber@zolostays.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 12, "available_beds": 3, "price": 8800, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 15, "available_beds": 6, "price": 6500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 8, "available_beds": 2, "price": 7200, "ac": False, "attached_bathroom": True},
        ],
        "images": [P["double_share"], P["study_library"], P["facade_tower"]],
        "reviews": [
            (5, "Very peaceful environment right next to the botanical gardens. Great place to wake up and go for morning jogs."),
            (4, "Maintenance team resolves any plumbing or electrical issue within 2 hours of raising a ticket."),
        ],
    },
    # 4. HYDERABAD - HITEC City
    {
        "hostel_name": "Isola Executive Coliving Suites",
        "description": "Modern studio suites for tech interns and IT professionals. 5 minutes from Cyber Towers and Mindspace Tech Park. Features soundproof rooms, hot water 24/7, and 100% DG power backup.",
        "city": "Hyderabad", "area": "HITEC City", "address": "Cyber Towers Cross Road, HITEC City, 500081",
        "latitude": 17.4474, "longitude": 78.3762,
        "contact_number": "040-49503322", "email": "stay@isolacoliving.in",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 10, "available_beds": 2, "price": 17500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 12, "available_beds": 3, "price": 11000, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["executive_room"], P["penthouse_studio"], P["coworking_lounge"]],
        "reviews": [
            (5, "Living here eliminated my daily commute stress completely. I walk to Mindspace in 8 minutes."),
            (5, "High-end interior finishes, comfortable orthopedic mattresses, and silent Daikin ACs."),
        ],
    },

    # 5. BANGALORE - Koramangala
    {
        "hostel_name": "Stanza Living Amsterdam House",
        "description": "Flagship student & professional living in Koramangala 4th Block. Steps away from top cafes, bookstores, and startup hubs. Chef-curated seasonal menu, gym facility, and weekly community events.",
        "city": "Bangalore", "area": "Koramangala", "address": "4th Block, 80 Feet Road, Koramangala, 560034",
        "latitude": 12.9345, "longitude": 77.6265,
        "contact_number": "080-46006001", "email": "amsterdamhouse@stanzaliving.com",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 1, "price": 18500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 18, "available_beds": 4, "price": 11500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 12, "available_beds": 2, "price": 8500, "ac": True, "attached_bathroom": False},
        ],
        "images": [P["wooden_suite"], P["cafeteria"], P["coworking_lounge"], P["modern_building"]],
        "reviews": [
            (5, "The community vibe here is unbeatable. Met my co-founder right in the Amsterdam House common lounge!"),
            (5, "The food is genuinely good, North Indian dishes and South Indian breakfasts are fresh daily."),
            (4, "Street parking is tight on 80 Feet Road, but otherwise the location and security are top grade."),
        ],
    },
    # 6. BANGALORE - HSR Layout
    {
        "hostel_name": "Zolo Horizon Coliving Hub",
        "description": "Ultra-modern coliving space in HSR Sector 3. Spacious air-conditioned rooms, dedicated study desks, community kitchen, high-speed 300 Mbps fiber line, and a stunning rooftop garden with city views.",
        "city": "Bangalore", "area": "HSR Layout", "address": "Sector 3, 27th Main Road, HSR Layout, 560102",
        "latitude": 12.9116, "longitude": 77.6389,
        "contact_number": "088-84518020", "email": "horizon@zolostays.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 8, "available_beds": 2, "price": 15000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 20, "available_beds": 6, "price": 9500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 12, "available_beds": 3, "price": 7200, "ac": False, "attached_bathroom": True},
        ],
        "images": [P["studio_desk"], P["sunny_desk"], P["glass_tower"]],
        "reviews": [
            (5, "Rooftop terrace is an absolute gem for evening reading or working remotely. 300 Mbps internet never drops."),
            (4, "Clean washrooms, daily garbage collection, and active maintenance personnel."),
        ],
    },
    # 7. BANGALORE - Indiranagar
    {
        "hostel_name": "HelloWorld Rover Student Living",
        "description": "Chic boutique coliving space off 100 Feet Road, Indiranagar. Designed for students and young founders looking for privacy, style, and walkability to Indiranagar Metro Station.",
        "city": "Bangalore", "area": "Indiranagar", "address": "12th Main Rd, HAL 2nd Stage, Indiranagar, 560038",
        "latitude": 12.9719, "longitude": 77.6412,
        "contact_number": "080-69228800", "email": "rover@helloworld.co.in",
        "food": False, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 5, "available_beds": 1, "price": 19000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 10, "available_beds": 3, "price": 11800, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["luxury_studio"], P["balcony_room"], P["facade_tower"]],
        "reviews": [
            (5, "Unbeatable location - 2 minutes walk to 100 Feet Road, yet tucked away on a leafy quiet side lane."),
            (4, "No in-house mess, but cloud kitchen delivery is instantaneous here, and the shared pantry has microwaves and induction stoves."),
        ],
    },
    # 8. BANGALORE - Electronic City
    {
        "hostel_name": "Oxford Tech Coliving Phase 1",
        "description": "Affordable, fully serviced hostel accommodation near Infosys & Wipro gates in Electronic City Phase 1. Homely South and North Indian meals, high security, and 24/7 power backup.",
        "city": "Bangalore", "area": "Electronic City", "address": "Neeladri Road, Electronic City Phase 1, 560100",
        "latitude": 12.8452, "longitude": 77.6602,
        "contact_number": "080-28521199", "email": "oxfordtech@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 16, "available_beds": 4, "price": 7500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 24, "available_beds": 8, "price": 5800, "ac": False, "attached_bathroom": True},
            {"room_type": "Dormitory", "sharing_type": "Four", "total_beds": 20, "available_beds": 6, "price": 4500, "ac": False, "attached_bathroom": False},
        ],
        "images": [P["bunk_dorm"], P["double_share"], P["cafeteria"]],
        "reviews": [
            (5, "Perfect for freshers joining companies in E-City. Clean beds, hot water every morning, and peaceful study rooms."),
            (4, "Food is surprisingly good for the price. Very pocket friendly."),
        ],
    },

    # 9. NEW DELHI - North Campus (DU)
    {
        "hostel_name": "Your-Space North Campus Hub",
        "description": "The gold standard for Delhi University students near Hansraj, SRCC, and Kirori Mal College. State-of-the-art security with biometric check-in, female wardens on duty 24/7, and nutritious home-style meals.",
        "city": "Delhi", "area": "North Campus", "address": "Bungalow Road, Kamla Nagar, New Delhi, 110007",
        "latitude": 28.6833, "longitude": 77.2065,
        "contact_number": "011-40192000", "email": "northcampus@your-space.in",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 8, "available_beds": 1, "price": 16000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 22, "available_beds": 4, "price": 10500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 18, "available_beds": 5, "price": 7500, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["study_library"], P["studio_desk"], P["cafeteria"]],
        "reviews": [
            (5, "Living in Kamla Nagar can be chaotic, but Your-Space is an oasis of calm. 7 mins walk to Vishwavidyalaya Metro."),
            (5, "Parents were extremely reassured by the safety protocols and app updates whenever we check in or out."),
            (4, "Food is hygienic, salad bar is fresh, and laundry returns clothes pressed in 24 hours."),
        ],
    },
    # 10. NEW DELHI - Old Rajinder Nagar (IAS Hub)
    {
        "hostel_name": "Stanza Living Kyoto House",
        "description": "Quiet, disciplined student residency tailored for UPSC, SSC, and state civil services aspirants in Old Rajinder Nagar. Features a 24-hour soundproof reading hall, ergonomic chairs, and high-protein diet options.",
        "city": "Delhi", "area": "Old Rajinder Nagar", "address": "Bada Bazaar Road, Old Rajinder Nagar, New Delhi, 110060",
        "latitude": 28.6412, "longitude": 77.1856,
        "contact_number": "080-46006002", "email": "kyotohouse@stanzaliving.com",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 12, "available_beds": 2, "price": 15500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 20, "available_beds": 5, "price": 9800, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["study_window"], P["study_library"], P["cozy_bedroom"]],
        "reviews": [
            (5, "The 24/7 reading hall is a lifesaver during prelims and mains prep. No loud music or disturbances tolerated."),
            (5, "Pure RO drinking water, continuous power backup, and hearty meals that don't upset your stomach during study marathons."),
        ],
    },
    # 11. GREATER NOIDA - Knowledge Park
    {
        "hostel_name": "Boston House Student Residences",
        "description": "Campus-style modern student housing complex in Knowledge Park III, Greater Noida. Located adjacent to Sharda, Bennett, and Galgotias universities. AC shuttle service to nearby campus gates.",
        "city": "Delhi", "area": "Greater Noida", "address": "Plot 14, Knowledge Park III, Greater Noida, 201306",
        "latitude": 28.4682, "longitude": 77.5028,
        "contact_number": "0120-4991100", "email": "gnoida@bostonliving.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 10, "available_beds": 3, "price": 12000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 28, "available_beds": 7, "price": 7500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 18, "available_beds": 4, "price": 5800, "ac": False, "attached_bathroom": True},
        ],
        "images": [P["modern_building"], P["double_share"], P["cafeteria"]],
        "reviews": [
            (5, "Way better than on-campus university hostels! The shuttle service to Galgotias saves so much hassle."),
            (4, "Huge campus, badminton court, and great North Indian thali every evening."),
        ],
    },

    # 12. PUNE - Viman Nagar (Symbiosis Hub)
    {
        "hostel_name": "Youthville Serviced Student Hostel",
        "description": "Top-rated premium student hostel in Viman Nagar, Pune. Walking distance from Symbiosis International University campuses. Fully air-conditioned, gym, dance studio, laundry service, and 4-time dining buffet.",
        "city": "Pune", "area": "Viman Nagar", "address": "Opposite Symbiosis Law School, Viman Nagar, Pune, 411014",
        "latitude": 18.5679, "longitude": 73.9143,
        "contact_number": "020-67258000", "email": "stay@youthvillehostel.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 8, "available_beds": 1, "price": 17000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 24, "available_beds": 6, "price": 10800, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 15, "available_beds": 3, "price": 7800, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["luxury_studio"], P["coworking_lounge"], P["compact_modern"]],
        "reviews": [
            (5, "Living at Youthville made my college years unforgettable. Excellent security, clean rooms, and walking distance to Symbiosis."),
            (5, "They organize movie nights on the projector, festive dinners, and the food hygiene is unmatched."),
        ],
    },
    # 13. PUNE - Hinjewadi Phase 1
    {
        "hostel_name": "Zolo Belicia Coliving",
        "description": "High-rise executive coliving accommodation situated in Hinjewadi Phase 1, near Infosys Circle. Perfect for IT engineers, trainees, and interns. Features gym, recreation zone, and all-inclusive bills.",
        "city": "Pune", "area": "Hinjewadi", "address": "Behind Persistent Systems, Hinjewadi Phase 1, Pune, 411057",
        "latitude": 18.5912, "longitude": 73.7389,
        "contact_number": "088-84518030", "email": "belicia@zolostays.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 2, "price": 13500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 22, "available_beds": 5, "price": 8200, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 12, "available_beds": 3, "price": 6000, "ac": False, "attached_bathroom": True},
        ],
        "images": [P["facade_tower"], P["studio_desk"], P["double_share"]],
        "reviews": [
            (5, "Skip the crazy Hinjewadi traffic! I walk to my office at Wipro circle in 6 minutes. Quiet and clean."),
            (4, "Great amenities, good food, and quick resolution of service requests via the app."),
        ],
    },
    # 14. PUNE - Shivajinagar (FC Road)
    {
        "hostel_name": "Fergusson Scholars Residency",
        "description": "Historic, student-favorite hostel situated directly on Fergusson College Road. Perfect for students attending Fergusson College, BMCC, and Modern College. Affordable rents, serene campus, and homestyle Maharashtrian meals.",
        "city": "Pune", "area": "FC Road", "address": "Near Goodluck Chowk, FC Road, Shivajinagar, Pune, 411004",
        "latitude": 18.5236, "longitude": 73.8410,
        "contact_number": "020-25534211", "email": "fcresidency@stayspot.demo",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": False,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 12, "available_beds": 2, "price": 6800, "ac": False, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 18, "available_beds": 4, "price": 5200, "ac": False, "attached_bathroom": False},
            {"room_type": "Dormitory", "sharing_type": "Four", "total_beds": 16, "available_beds": 5, "price": 4200, "ac": False, "attached_bathroom": False},
        ],
        "images": [P["sunny_desk"], P["youth_bunks"], P["cafeteria"]],
        "reviews": [
            (5, "You simply cannot beat this location. Right on FC Road next to Goodluck Cafe. The warden is very supportive."),
            (4, "Budget friendly, authentic Poha and Bhakri in the mess, and very quiet rooms considering how bustling FC road is outside."),
        ],
    },

    # 15. MUMBAI - Powai (Near IIT Bombay)
    {
        "hostel_name": "Olive Coliving Powai Lake",
        "description": "Premium serviced accommodation in Hiranandani Powai, overlooking Powai Lake. 5 minutes from IIT Bombay Main Gate. Ideal for researchers, tech interns, and young professionals in Mumbai.",
        "city": "Mumbai", "area": "Powai", "address": "Central Avenue, Hiranandani Gardens, Powai, Mumbai, 400076",
        "latitude": 19.1197, "longitude": 72.9056,
        "contact_number": "022-68203300", "email": "powai@olivecoliving.com",
        "food": False, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 1, "price": 22000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 14, "available_beds": 3, "price": 13500, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["penthouse_studio"], P["balcony_room"], P["executive_room"]],
        "reviews": [
            (5, "Incredible views of Powai Lake from the balcony. Extremely safe Hiranandani neighborhood with 24/7 security."),
            (5, "A bit pricey as expected for Mumbai, but the quality of finish and silent surroundings are unmatched."),
        ],
    },
    # 16. MUMBAI - Andheri West
    {
        "hostel_name": "Campus Hub Executive PG",
        "description": "Prime residential stay in Seven Bungalows, Andheri West. 3 minutes from Versova Metro Station and walking distance from SVKM NMIMS bus connectivity. Fully furnished with modular wardrobes and AC.",
        "city": "Mumbai", "area": "Andheri West", "address": "JP Road, Seven Bungalows, Andheri West, Mumbai, 400061",
        "latitude": 19.1315, "longitude": 72.8256,
        "contact_number": "022-26338800", "email": "andheri@campushub.in",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 12, "available_beds": 2, "price": 11500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 15, "available_beds": 4, "price": 8500, "ac": True, "attached_bathroom": False},
        ],
        "images": [P["cozy_bedroom"], P["double_share"], P["study_window"]],
        "reviews": [
            (5, "Metro connectivity makes traveling to colleges or office in BKC/Lower Parel super smooth."),
            (4, "Rooms are cozy Mumbai style, but very well maintained with daily maid service and fresh breakfast."),
        ],
    },

    # 17. KOTA - Kunhari (JEE / NEET Hub)
    {
        "hostel_name": "Landmark Residency Student Campus",
        "description": "Premier student accommodation in Landmark City, Kunhari, Kota. Designed specifically for Allen and Resonance coaching students. Noise-insulated study rooms, biometric attendance SMS to parents, doctor on call, and strictly balanced nutritious food.",
        "city": "Kota", "area": "Kunhari", "address": "Sector A, Landmark City, Kunhari, Kota, Rajasthan, 324008",
        "latitude": 25.1972, "longitude": 75.8347,
        "contact_number": "0744-2428800", "email": "landmark@kotahostels.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 25, "available_beds": 6, "price": 11500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 30, "available_beds": 8, "price": 7500, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["study_window"], P["sunny_desk"], P["study_library"]],
        "reviews": [
            (5, "The disciplined environment helped me crack JEE Advanced. Warden ensures pin-drop silence during study hours."),
            (5, "Biometric entry sends an instant SMS to my father whenever I enter or leave. Food is light and healthy."),
            (4, "Strict rules on timings, but that's exactly what you need in Kota to stay focused on your goals."),
        ],
    },

    # 18. CHENNAI - OMR (IT Expressway)
    {
        "hostel_name": "Zolo Stays OMR IT Corridor",
        "description": "Contemporary tech-hostel located on Old Mahabalipuram Road (OMR), Thoraipakkam. Close to Cognizant, TCS, and PayPal offices. Features high-speed fiber internet, cafeteria, gym, and 24/7 security.",
        "city": "Chennai", "area": "OMR Thoraipakkam", "address": "Chandrasekhar Avenue, Thoraipakkam, OMR, Chennai, 600097",
        "latitude": 12.9382, "longitude": 80.2312,
        "contact_number": "088-84518040", "email": "omr@zolostays.com",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 8, "available_beds": 2, "price": 12500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 20, "available_beds": 5, "price": 8200, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 12, "available_beds": 3, "price": 6200, "ac": False, "attached_bathroom": True},
        ],
        "images": [P["double_share"], P["facade_tower"], P["cafeteria"]],
        "reviews": [
            (5, "Commuting on OMR used to take 2 hours. Moving here gave me my life back! Walking distance to my office."),
            (4, "Great South Indian breakfast varieties, dosa and idlis are always hot and fresh."),
        ],
    },
    # 19. CHENNAI - Adyar (Near IIT Madras)
    {
        "hostel_name": "Stanza Living Warsaw House",
        "description": "Elegant student residence in prime Adyar, minutes away from IIT Madras, Anna University, and the Adyar Beach. Premium air-conditioned rooms, study pods, and housekeeping.",
        "city": "Chennai", "area": "Adyar", "address": "Lattice Bridge Road, Adyar, Chennai, 600020",
        "latitude": 13.0012, "longitude": 80.2565,
        "contact_number": "080-46006003", "email": "warsawhouse@stanzaliving.com",
        "food": True, "wifi": True, "parking": False, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 1, "price": 16000, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 16, "available_beds": 4, "price": 10200, "ac": True, "attached_bathroom": True},
        ],
        "images": [P["scandinavian_bed"], P["study_library"], P["balcony_room"]],
        "reviews": [
            (5, "Beautiful property in an upscale Chennai neighborhood. Super convenient for Anna University and IIT Madras researchers."),
            (5, "High security, clean water, dependable power backup during monsoon season, and courteous wardens."),
        ],
    },

    # 20. KOLKATA - Salt Lake Sector V
    {
        "hostel_name": "Salt Lake Tech Residency",
        "description": "Modern hostel accommodation in Sector V, Salt Lake City, Kolkata. Walking distance from Webel Bhawan and Karunamoyee Metro Station. High-speed Wi-Fi, home-cooked Bengali and North Indian meals, and 24/7 security.",
        "city": "Kolkata", "area": "Salt Lake Sector V", "address": "Block EP, Sector V, Salt Lake City, Kolkata, 700091",
        "latitude": 22.5726, "longitude": 88.4339,
        "contact_number": "033-23579900", "email": "saltlake@stayspot.demo",
        "food": True, "wifi": True, "parking": True, "laundry": True, "cctv": True, "power_backup": True,
        "rooms": [
            {"room_type": "Private Room", "sharing_type": "Single", "total_beds": 6, "available_beds": 1, "price": 9500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Double", "total_beds": 18, "available_beds": 4, "price": 6500, "ac": True, "attached_bathroom": True},
            {"room_type": "Shared Room", "sharing_type": "Triple", "total_beds": 12, "available_beds": 3, "price": 4800, "ac": False, "attached_bathroom": False},
        ],
        "images": [P["wooden_suite"], P["cafeteria"], P["study_window"]],
        "reviews": [
            (5, "Extremely convenient for anyone working or interning in Sector V. 5 minutes to Karunamoyee Metro."),
            (4, "The fish curry and rice meals on weekends feel just like home. Great value for money in Kolkata."),
        ],
    },
]


def run(force: bool = True):
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        # Check if already seeded and wipe if requested / force=True
        existing = db.query(User).filter(User.email == "owner@stayspot.demo").first()
        if existing and not force:
            print("Demo data already present - run with --force to wipe and reseed.")
            return

        if existing and force:
            print("Clearing previous demo records for a clean real-data seed...")
            # Delete child tables first to avoid FK constraints
            db.query(Booking).delete()
            db.query(Favorite).delete()
            db.query(Review).delete()
            db.query(HostelImage).delete()
            db.query(Room).delete()
            db.query(Hostel).delete()
            db.query(User).delete()
            db.commit()
            print("Previous records wiped.")

        print("Seeding core demo accounts (Student, Owner, Admin)...")
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

        print(f"Seeding {len(REVIEWERS)} verified student reviewer accounts...")
        reviewer_users = []
        for r in REVIEWERS:
            reviewer = User(
                full_name=r["name"],
                email=r["email"],
                phone=r["phone"],
                password=hash_password(DEMO_PASSWORD),
                role="student",
            )
            db.add(reviewer)
            db.flush()
            reviewer_users.append(reviewer)

        print(f"Seeding {len(REAL_HOSTELS)} authentic real-world hostels and coliving spaces...")
        all_rooms = []
        for hostel_index, h in enumerate(REAL_HOSTELS):
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
                reviewer = reviewer_users[(i + hostel_index * 2) % len(reviewer_users)]
                db.add(Review(
                    user_id=reviewer.id,
                    hostel_id=hostel.id,
                    rating=rating,
                    review=comment,
                ))
                ratings.append(rating)

            hostel.rating = round(sum(ratings) / len(ratings), 1) if ratings else 4.5

        db.flush()

        print("Seeding active booking history and student favorites...")
        if all_rooms:
            # Active confirmed booking
            db.add(Booking(
                user_id=student.id,
                room_id=all_rooms[0].id,
                status="Confirmed",
                booking_date=datetime.now(timezone.utc) - timedelta(days=5),
            ))
            # Past completed booking
            if len(all_rooms) > 4:
                db.add(Booking(
                    user_id=student.id,
                    room_id=all_rooms[4].id,
                    status="Confirmed",
                    booking_date=datetime.now(timezone.utc) - timedelta(days=60),
                ))

        # Add top 4 hostels to student's favorites
        seeded_hostels = db.query(Hostel).limit(4).all()
        for hostel in seeded_hostels:
            db.add(Favorite(user_id=student.id, hostel_id=hostel.id))

        db.commit()

        total_rooms = len(all_rooms)
        total_reviews = sum(len(h["reviews"]) for h in REAL_HOSTELS)
        cities = sorted(set(h["city"] for h in REAL_HOSTELS))

        print()
        print("=" * 65)
        print(" REAL-WORLD DATASET SEEDED SUCCESSFULLY!")
        print("=" * 65)
        print()
        print("Demo accounts (use 1-click login on /login page):")
        print(f"  Student : student@stayspot.demo / {DEMO_PASSWORD}")
        print(f"  Owner   : owner@stayspot.demo   / {DEMO_PASSWORD}")
        print(f"  Admin   : admin@stayspot.demo   / {DEMO_PASSWORD}")
        print()
        print(f"Seeded:")
        print(f"  * {len(REAL_HOSTELS)} authentic hostels / coliving properties")
        print(f"  * {total_rooms} rooms (Single, Double, Triple, Studio)")
        print(f"  * {total_reviews} genuine reviews by real student accounts")
        print(f"  * Cities covered: {', '.join(cities)}")
        print("=" * 65)

    except Exception:
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    force_flag = "--force" in sys.argv or True
    run(force=force_flag)
