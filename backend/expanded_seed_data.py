"""
Enhanced data seeder for The DowUrk FramewUrk
Creates a comprehensive dataset of Louisiana businesses, events, resources, and grants
This can be replaced with real API integration once API keys are obtained
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path
import random

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Louisiana cities and parishes
LOUISIANA_CITIES = [
    ("New Orleans", "Orleans"),
    ("Baton Rouge", "East Baton Rouge"),
    ("Shreveport", "Caddo"),
    ("Lafayette", "Lafayette"),
    ("Lake Charles", "Calcasieu"),
    ("Kenner", "Jefferson"),
    ("Bossier City", "Bossier"),
    ("Monroe", "Ouachita"),
    ("Alexandria", "Rapides"),
    ("Hammond", "Tangipahoa"),
    ("Metairie", "Jefferson"),
    ("Houma", "Terrebonne"),
    ("Slidell", "St. Tammany"),
    ("Ruston", "Lincoln"),
    ("Natchitoches", "Natchitoches")
]

# Expanded business categories from user requirements
BUSINESS_CATEGORIES = {
    "food": [
        "Soul Food Restaurant", "Cajun Catering", "Food Truck", "Bakery", 
        "Seafood Market", "Coffee Shop", "Meal Prep Service"
    ],
    "retail": [
        "Clothing Boutique", "Beauty Supply Store", "Bookstore", "Gift Shop",
        "Home Decor", "Jewelry Store", "Convenience Store"
    ],
    "service": [
        "Lawn Care", "Cleaning Service", "Pest Control", "HVAC Service",
        "Plumbing", "Electrical Contractor", "Auto Repair"
    ],
    "professional": [
        "Law Firm", "Accounting Firm", "Real Estate Agency", "Insurance Agency",
        "Consulting Firm", "Financial Planning", "Marketing Agency"
    ],
    "health": [
        "Medical Clinic", "Dental Practice", "Therapy Practice", "Massage Therapy",
        "Fitness Studio", "Nutrition Counseling", "Mobile Phlebotomy"
    ],
    "creative": [
        "Graphic Design Studio", "Photography", "Event Planning", "Music Studio",
        "Art Gallery", "Cultural Arts Center", "Web Design"
    ],
    "technology": [
        "IT Consulting", "Software Development", "Mobile App Development",
        "Cybersecurity", "Tech Support", "E-commerce Solutions"
    ],
    "education": [
        "Tutoring Service", "Daycare Center", "Music Lessons", "STEM Programs",
        "Trade Skills Training", "Language School"
    ],
    "beauty": [
        "Hair Salon", "Barbershop", "Nail Salon", "Spa Services",
        "Makeup Artist", "Skincare Clinic"
    ],
    "construction": [
        "General Contractor", "Roofing", "Painting", "Carpentry",
        "Renovation Services", "Concrete Work"
    ]
}

def generate_business_data(index):
    """Generate realistic Louisiana business data"""
    category = random.choice(list(BUSINESS_CATEGORIES.keys()))
    business_type = random.choice(BUSINESS_CATEGORIES[category])
    city, parish = random.choice(LOUISIANA_CITIES)
    
    # Generate business name
    prefixes = ["Louisiana", "Bayou", "Delta", "Creole", "Southern", "Magnolia", "Crescent", "Pelican"]
    suffixes = ["Group", "Services", "Solutions", "Co.", "LLC", "Enterprise", "Studio", "Works"]
    business_name = f"{random.choice(prefixes)} {business_type} {random.choice(suffixes)}"
    
    # Generate owner name
    first_names = ["James", "Michael", "Robert", "Mary", "Patricia", "Jennifer", "Linda", "Latoya", 
                   "Marcus", "Jasmine", "Antoine", "Keisha", "Damon", "Tiffany", "Andre"]
    last_names = ["Johnson", "Williams", "Brown", "Jones", "Davis", "Miller", "Wilson", "Moore",
                  "Taylor", "Anderson", "Thomas", "Jackson", "White", "Harris", "Martin"]
    owner_name = f"{random.choice(first_names)} {random.choice(last_names)}"
    
    # Generate contact info
    area_codes = ["504", "225", "318", "337", "985", "985"]
    phone = f"({random.choice(area_codes)}) 555-{random.randint(1000, 9999)}"
    email = f"{owner_name.lower().replace(' ', '.')}@{business_name.lower().replace(' ', '')}.com"
    
    # Generate address
    street_names = ["Main", "Oak", "Elm", "Magazine", "Canal", "Royal", "Bourbon", "Jefferson", 
                    "Louisiana", "Government", "Florida", "Highland", "Airline", "Veterans"]
    address = f"{random.randint(100, 9999)} {random.choice(street_names)} St"
    
    # Services based on category
    services_map = {
        "food": ["Dine-in", "Takeout", "Delivery", "Catering", "Private Events"],
        "retail": ["In-store Shopping", "Online Orders", "Curbside Pickup", "Custom Orders"],
        "service": ["Residential", "Commercial", "Emergency Service", "Free Estimates"],
        "professional": ["Consultations", "Strategic Planning", "Compliance", "Representation"],
        "health": ["Appointments", "Walk-ins", "Telehealth", "House Calls"],
        "creative": ["Custom Projects", "Event Services", "Portfolio Review", "Classes"],
        "technology": ["On-site Service", "Remote Support", "Custom Development", "Training"],
        "education": ["Group Classes", "Private Lessons", "Online Learning", "Workshops"],
        "beauty": ["Walk-ins", "Appointments", "Mobile Service", "Bridal Packages"],
        "construction": ["Free Quotes", "Licensed & Insured", "Residential", "Commercial"]
    }
    
    return {
        "id": f"biz-{str(index).zfill(4)}",
        "business_name": business_name,
        "owner_name": owner_name,
        "email": email,
        "phone": phone,
        "category": category,
        "description": f"{business_type} serving the {city} area. Committed to quality service and customer satisfaction. Black-owned and operated.",
        "address": address,
        "city": city,
        "parish": parish,
        "zip_code": str(random.randint(70000, 71500)),
        "website": f"https://{business_name.lower().replace(' ', '')}.com",
        "social_media": {
            "facebook": f"https://facebook.com/{business_name.lower().replace(' ', '')}",
            "instagram": f"https://instagram.com/{business_name.lower().replace(' ', '')}"
        },
        "hours_of_operation": "Mon-Fri: 9am-6pm, Sat: 10am-4pm",
        "services_offered": random.sample(services_map.get(category, ["General Services"]), 
                                         min(3, len(services_map.get(category, ["General Services"])))),
        "user_id": f"user-{str(random.randint(1, 100)).zfill(3)}",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": random.choice([True, True, True, False]),  # 75% verified
        "rating": round(random.uniform(4.0, 5.0), 1),
        "review_count": random.randint(5, 150)
    }

async def seed_expanded_database():
    """Seed database with expanded Louisiana business data"""
    print("🌱 Starting expanded database seeding...")
    print("=" * 60)
    
    # Clear existing data
    print("🗑️  Clearing existing sample data...")
    await db.businesses.delete_many({"id": {"$regex": "^biz-"}})
    await db.events.delete_many({"id": {"$regex": "^event-"}})
    
    # Generate 100+ businesses across Louisiana
    print("🏢 Generating Louisiana businesses...")
    businesses = [generate_business_data(i) for i in range(1, 151)]  # 150 businesses
    
    # Insert in batches to avoid timeout
    batch_size = 50
    for i in range(0, len(businesses), batch_size):
        batch = businesses[i:i + batch_size]
        await db.businesses.insert_many(batch)
        print(f"   ✓ Inserted businesses {i+1}-{min(i+batch_size, len(businesses))}")
    
    # Generate more events
    event_types = ["workshop", "webinar", "networking", "training", "conference"]
    event_titles = [
        "Small Business Tax Planning Workshop",
        "Digital Marketing Masterclass",
        "Entrepreneurship Networking Mixer",
        "Grant Writing Bootcamp",
        "Business Credit Building Seminar",
        "Social Media for Small Business",
        "QuickBooks Training for Beginners",
        "Legal Essentials for Entrepreneurs",
        "E-commerce Setup Workshop",
        "Pitch Perfect: Investor Presentation Skills"
    ]
    
    events = []
    for i, title in enumerate(event_titles, 1):
        city, _ = random.choice(LOUISIANA_CITIES)
        events.append({
            "id": f"event-{str(i).zfill(3)}",
            "title": title,
            "description": f"Join us for this {random.choice(event_types)} focused on helping Louisiana entrepreneurs succeed. Perfect for business owners at all stages.",
            "event_type": random.choice(event_types),
            "start_time": (datetime.now(timezone.utc) + timedelta(days=random.randint(7, 90))).isoformat(),
            "end_time": (datetime.now(timezone.utc) + timedelta(days=random.randint(7, 90), hours=random.randint(2, 4))).isoformat(),
            "location": f"{city} Business Center",
            "organizer": "DowUrk Inc.",
            "max_attendees": random.randint(25, 100),
            "registration_link": f"https://dowurktoday.com/events/{title.lower().replace(' ', '-')}",
            "tags": ["entrepreneurship", "business", "training"],
            "created_at": datetime.now(timezone.utc).isoformat(),
            "attendees": [],
            "is_active": True
        })
    
    await db.events.insert_many(events)
    print(f"📅 Inserted {len(events)} events")
    
    print("=" * 60)
    print("✅ Database seeding completed successfully!")
    print(f"   📊 Total businesses: {len(businesses)}")
    print(f"   📊 Total events: {len(events)}")
    print(f"   🌍 Cities covered: {len(LOUISIANA_CITIES)}")
    print(f"   🏷️  Categories: {len(BUSINESS_CATEGORIES)}")
    print("=" * 60)
    print("💡 Note: This data can be replaced with real API data once Louisiana")
    print("   Secretary of State API keys are obtained.")

async def main():
    try:
        await seed_expanded_database()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
