"""
Sample data seeder for DowUrk H.U.B. Platform
Creates sample businesses, events, resources, and grants for Louisiana
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient
from datetime import datetime, timezone, timedelta
import os
from dotenv import load_dotenv
from pathlib import Path

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Sample Louisiana Businesses
SAMPLE_BUSINESSES = [
    {
        "id": "biz-001",
        "business_name": "Creole Kitchen Delights",
        "owner_name": "Marie Johnson",
        "email": "marie@creolekitchen.com",
        "phone": "(504) 555-0101",
        "category": "food",
        "description": "Authentic Creole and Cajun cuisine featuring family recipes passed down through generations. Catering and meal prep services available.",
        "address": "1234 Magazine St",
        "city": "New Orleans",
        "parish": "Orleans",
        "zip_code": "70130",
        "website": "https://creolekitchendelights.com",
        "social_media": {
            "facebook": "https://facebook.com/creolekitchen",
            "instagram": "https://instagram.com/creolekitchen"
        },
        "hours_of_operation": "Mon-Sat: 11am-9pm, Sun: Closed",
        "services_offered": ["Dine-in", "Takeout", "Catering", "Meal Prep"],
        "user_id": "user-001",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": True,
        "rating": 4.8,
        "review_count": 127
    },
    {
        "id": "biz-002",
        "business_name": "Delta Tech Solutions",
        "owner_name": "James Washington",
        "email": "james@deltatechla.com",
        "phone": "(225) 555-0202",
        "category": "technology",
        "description": "Full-service IT consulting, web development, and cybersecurity solutions for Louisiana small businesses.",
        "address": "567 Florida Blvd",
        "city": "Baton Rouge",
        "parish": "East Baton Rouge",
        "zip_code": "70801",
        "website": "https://deltatechla.com",
        "social_media": {
            "linkedin": "https://linkedin.com/company/deltatechla",
            "twitter": "https://twitter.com/deltatechla"
        },
        "hours_of_operation": "Mon-Fri: 9am-6pm",
        "services_offered": ["IT Consulting", "Web Development", "Cybersecurity", "Cloud Solutions"],
        "user_id": "user-002",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": True,
        "rating": 4.9,
        "review_count": 85
    },
    {
        "id": "biz-003",
        "business_name": "Bayou Threads Boutique",
        "owner_name": "Latoya Brown",
        "email": "latoya@bayouthreads.com",
        "phone": "(337) 555-0303",
        "category": "retail",
        "description": "Contemporary fashion boutique featuring local designers and culturally inspired clothing and accessories.",
        "address": "890 Jefferson St",
        "city": "Lafayette",
        "parish": "Lafayette",
        "zip_code": "70501",
        "website": "https://bayouthreads.com",
        "social_media": {
            "instagram": "https://instagram.com/bayouthreads",
            "facebook": "https://facebook.com/bayouthreads"
        },
        "hours_of_operation": "Mon-Sat: 10am-7pm, Sun: 12pm-5pm",
        "services_offered": ["Retail", "Personal Styling", "Custom Orders"],
        "user_id": "user-003",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": True,
        "rating": 4.7,
        "review_count": 64
    },
    {
        "id": "biz-004",
        "business_name": "Southern Roots Landscaping",
        "owner_name": "Marcus Thompson",
        "email": "marcus@southernrootsla.com",
        "phone": "(318) 555-0404",
        "category": "service",
        "description": "Professional landscaping, lawn care, and outdoor design services. Specializing in native Louisiana plants and sustainable practices.",
        "address": "234 Kings Hwy",
        "city": "Shreveport",
        "parish": "Caddo",
        "zip_code": "71101",
        "website": "https://southernrootsla.com",
        "social_media": {
            "facebook": "https://facebook.com/southernrootsla",
            "instagram": "https://instagram.com/southernrootsla"
        },
        "hours_of_operation": "Mon-Fri: 7am-5pm, Sat: 8am-2pm",
        "services_offered": ["Landscaping", "Lawn Maintenance", "Design Consultation", "Irrigation"],
        "user_id": "user-004",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": True,
        "rating": 4.6,
        "review_count": 52
    },
    {
        "id": "biz-005",
        "business_name": "Magnolia Creative Studio",
        "owner_name": "Jasmine Williams",
        "email": "jasmine@magnoliacreative.com",
        "phone": "(985) 555-0505",
        "category": "creative",
        "description": "Full-service creative agency offering branding, graphic design, photography, and digital marketing services.",
        "address": "456 Hammond Square",
        "city": "Hammond",
        "parish": "Tangipahoa",
        "zip_code": "70401",
        "website": "https://magnoliacreative.com",
        "social_media": {
            "instagram": "https://instagram.com/magnoliacreative",
            "behance": "https://behance.net/magnoliacreative",
            "linkedin": "https://linkedin.com/company/magnoliacreative"
        },
        "hours_of_operation": "Mon-Fri: 9am-6pm",
        "services_offered": ["Branding", "Graphic Design", "Photography", "Social Media Marketing"],
        "user_id": "user-005",
        "created_at": datetime.now(timezone.utc).isoformat(),
        "updated_at": datetime.now(timezone.utc).isoformat(),
        "is_verified": True,
        "rating": 5.0,
        "review_count": 43
    }
]

# Sample Events
SAMPLE_EVENTS = [
    {
        "id": "event-001",
        "title": "Small Business Saturday Workshop",
        "description": "Learn strategies to maximize your Small Business Saturday sales. Topics include social media marketing, email campaigns, and in-store promotions.",
        "event_type": "workshop",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=7)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=7, hours=3)).isoformat(),
        "location": "Louisiana SBDC - New Orleans Office",
        "organizer": "DowUrk Inc. & Louisiana SBDC",
        "max_attendees": 50,
        "registration_link": "https://dowurktoday.com/events/small-business-saturday",
        "tags": ["marketing", "retail", "holidays"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "attendees": [],
        "is_active": True
    },
    {
        "id": "event-002",
        "title": "Access to Capital: Grant Writing Bootcamp",
        "description": "Intensive 2-day bootcamp covering grant research, application strategies, and how to write compelling proposals.",
        "event_type": "training",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=14)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=15, hours=5)).isoformat(),
        "location": "Baton Rouge Business Hub",
        "organizer": "DowUrk Inc.",
        "max_attendees": 30,
        "registration_link": "https://dowurktoday.com/events/grant-writing",
        "tags": ["funding", "grants", "training"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "attendees": [],
        "is_active": True
    },
    {
        "id": "event-003",
        "title": "Black Business Networking Mixer",
        "description": "Connect with fellow Black entrepreneurs, share experiences, and build meaningful business relationships. Food and refreshments provided.",
        "event_type": "networking",
        "start_time": (datetime.now(timezone.utc) + timedelta(days=21)).isoformat(),
        "end_time": (datetime.now(timezone.utc) + timedelta(days=21, hours=3)).isoformat(),
        "location": "Lafayette Cultural Center",
        "organizer": "DowUrk Inc. & Black Chamber of Commerce",
        "max_attendees": 100,
        "registration_link": "https://dowurktoday.com/events/networking-mixer",
        "tags": ["networking", "community", "entrepreneurship"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "attendees": [],
        "is_active": True
    }
]

# Sample Resources
SAMPLE_RESOURCES = [
    {
        "id": "resource-001",
        "title": "Louisiana Business Formation Guide",
        "description": "Complete guide to forming your LLC or corporation in Louisiana. Includes step-by-step instructions, required forms, and fee schedules.",
        "resource_type": "article",
        "category": "legal",
        "url": "https://dowurktoday.com/resources/business-formation",
        "tags": ["legal", "LLC", "incorporation", "startup"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "views": 1247,
        "downloads": 342,
        "featured": True
    },
    {
        "id": "resource-002",
        "title": "Marketing Your Business on a Budget",
        "description": "Video course covering free and low-cost marketing strategies for small businesses. Includes social media, email marketing, and local SEO.",
        "resource_type": "video",
        "category": "marketing",
        "url": "https://youtube.com/watch?v=example",
        "tags": ["marketing", "social media", "budget", "digital marketing"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "views": 856,
        "downloads": 0,
        "featured": True
    },
    {
        "id": "resource-003",
        "title": "Business Plan Template",
        "description": "Professional business plan template with sections for executive summary, market analysis, financial projections, and more. Includes examples.",
        "resource_type": "template",
        "category": "business_planning",
        "url": "https://dowurktoday.com/downloads/business-plan-template",
        "tags": ["business plan", "template", "planning", "startup"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "views": 2103,
        "downloads": 589,
        "featured": True
    },
    {
        "id": "resource-004",
        "title": "Financial Literacy for Entrepreneurs",
        "description": "Comprehensive course covering accounting basics, cash flow management, financial statements, and tax planning for small business owners.",
        "resource_type": "course",
        "category": "finance",
        "url": "https://dowurktoday.com/courses/financial-literacy",
        "tags": ["finance", "accounting", "taxes", "financial planning"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "views": 634,
        "downloads": 0,
        "featured": False
    },
    {
        "id": "resource-005",
        "title": "The DowUrk Podcast: Entrepreneurship Stories",
        "description": "Weekly podcast featuring interviews with successful Louisiana entrepreneurs sharing their journeys, challenges, and lessons learned.",
        "resource_type": "podcast",
        "category": "business_planning",
        "url": "https://dowurktoday.com/podcast",
        "tags": ["podcast", "entrepreneurship", "success stories", "inspiration"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "views": 1876,
        "downloads": 0,
        "featured": True
    }
]

# Sample Grants
SAMPLE_GRANTS = [
    {
        "id": "grant-001",
        "title": "Louisiana Small Business Recovery Grant",
        "organization": "Louisiana Economic Development",
        "description": "Grant program providing up to $50,000 to Louisiana small businesses for recovery, expansion, and job creation.",
        "amount_range": "$10,000 - $50,000",
        "eligibility": [
            "Louisiana-based business",
            "25 or fewer employees",
            "In operation for at least 1 year",
            "Annual revenue under $1M"
        ],
        "deadline": (datetime.now(timezone.utc) + timedelta(days=60)).isoformat(),
        "application_link": "https://led.louisiana.gov/grants/recovery",
        "categories": ["general", "recovery", "expansion"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    },
    {
        "id": "grant-002",
        "title": "Minority Business Development Fund",
        "organization": "Louisiana Department of Commerce",
        "description": "Funding for minority-owned businesses to support growth, technology adoption, and workforce development.",
        "amount_range": "$5,000 - $25,000",
        "eligibility": [
            "Minority-owned (51%+ ownership)",
            "Louisiana-based",
            "In operation for at least 6 months",
            "Clear growth plan"
        ],
        "deadline": (datetime.now(timezone.utc) + timedelta(days=45)).isoformat(),
        "application_link": "https://commerce.louisiana.gov/minority-grants",
        "categories": ["minority", "growth", "technology"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    },
    {
        "id": "grant-003",
        "title": "Women Entrepreneurs Startup Grant",
        "organization": "Louisiana Women's Business Center",
        "description": "Seed funding for women-owned startups and early-stage businesses. Includes business coaching and mentorship.",
        "amount_range": "$2,500 - $10,000",
        "eligibility": [
            "Woman-owned (51%+ ownership)",
            "Louisiana resident",
            "Startup or less than 2 years in operation",
            "Viable business plan"
        ],
        "deadline": (datetime.now(timezone.utc) + timedelta(days=75)).isoformat(),
        "application_link": "https://lawbc.org/grants",
        "categories": ["women", "startup", "seed funding"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    },
    {
        "id": "grant-004",
        "title": "Rural Business Innovation Grant",
        "organization": "Louisiana Rural Development Authority",
        "description": "Grants for businesses in rural Louisiana parishes to support innovation, technology adoption, and job creation.",
        "amount_range": "$15,000 - $75,000",
        "eligibility": [
            "Located in rural Louisiana parish",
            "10+ employees or creating 5+ jobs",
            "Innovative business model or technology",
            "Matching funds required (25%)"
        ],
        "deadline": (datetime.now(timezone.utc) + timedelta(days=90)).isoformat(),
        "application_link": "https://ruralla.gov/innovation-grants",
        "categories": ["rural", "innovation", "job creation"],
        "created_at": datetime.now(timezone.utc).isoformat(),
        "is_active": True
    }
]

async def seed_database():
    """Seed the database with sample data"""
    print("Starting database seeding...")
    
    # Clear existing data (optional - comment out if you want to keep existing data)
    print("Clearing existing sample data...")
    await db.businesses.delete_many({"id": {"$regex": "^biz-"}})
    await db.events.delete_many({"id": {"$regex": "^event-"}})
    await db.resources.delete_many({"id": {"$regex": "^resource-"}})
    await db.grants.delete_many({"id": {"$regex": "^grant-"}})
    
    # Insert businesses
    print(f"Inserting {len(SAMPLE_BUSINESSES)} sample businesses...")
    if SAMPLE_BUSINESSES:
        await db.businesses.insert_many(SAMPLE_BUSINESSES)
    
    # Insert events
    print(f"Inserting {len(SAMPLE_EVENTS)} sample events...")
    if SAMPLE_EVENTS:
        await db.events.insert_many(SAMPLE_EVENTS)
    
    # Insert resources
    print(f"Inserting {len(SAMPLE_RESOURCES)} sample resources...")
    if SAMPLE_RESOURCES:
        await db.resources.insert_many(SAMPLE_RESOURCES)
    
    # Insert grants
    print(f"Inserting {len(SAMPLE_GRANTS)} sample grants...")
    if SAMPLE_GRANTS:
        await db.grants.insert_many(SAMPLE_GRANTS)
    
    print("✅ Database seeding completed successfully!")
    print(f"   - {len(SAMPLE_BUSINESSES)} businesses")
    print(f"   - {len(SAMPLE_EVENTS)} events")
    print(f"   - {len(SAMPLE_RESOURCES)} resources")
    print(f"   - {len(SAMPLE_GRANTS)} grants")

async def main():
    try:
        await seed_database()
    finally:
        client.close()

if __name__ == "__main__":
    asyncio.run(main())
