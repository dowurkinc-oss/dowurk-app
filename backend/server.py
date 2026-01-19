from fastapi import FastAPI, APIRouter, HTTPException, Depends, status, Request
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional, Dict, Any
import uuid
from datetime import datetime, timezone, timedelta
import jwt
from passlib.context import CryptContext

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Security
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
security = HTTPBearer()
JWT_SECRET = os.environ.get('JWT_SECRET', 'your-secret-key-change-in-production')
JWT_ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create the main app
app = FastAPI(title="The DowUrk FramewUrk API")
api_router = APIRouter(prefix="/api")

# ==================== MODELS ====================

# User Models
class UserBase(BaseModel):
    email: EmailStr
    full_name: str
    user_type: str = "entrepreneur"  # entrepreneur, mentor, admin, organization
    phone: Optional[str] = None
    location: Optional[str] = None
    bio: Optional[str] = None
    interests: List[str] = []
    
class UserCreate(UserBase):
    password: str

class User(UserBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True
    profile_image: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

# Business Models
class BusinessBase(BaseModel):
    business_name: str
    owner_name: str
    email: EmailStr
    phone: str
    category: str  # retail, service, technology, food, creative, etc.
    description: str
    address: str
    city: str
    parish: str  # Louisiana parishes
    zip_code: str
    website: Optional[str] = None
    social_media: Dict[str, str] = {}  # {"facebook": "url", "instagram": "url"}
    hours_of_operation: Optional[str] = None
    services_offered: List[str] = []
    organization_type: str = "for-profit"  # for-profit or non-profit
    certifications: List[str] = []  # List of business certifications
    
class Business(BusinessBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_verified: bool = False
    is_pending_approval: bool = True  # New businesses need approval
    logo_url: Optional[str] = None
    images: List[str] = []
    rating: float = 0.0
    review_count: int = 0

# Event Models
class EventBase(BaseModel):
    title: str
    description: str
    event_type: str  # workshop, webinar, networking, training, conference
    start_time: datetime
    end_time: datetime
    location: str
    organizer: str
    max_attendees: Optional[int] = None
    registration_link: Optional[str] = None
    tags: List[str] = []

class Event(EventBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    attendees: List[str] = []  # user IDs
    is_active: bool = True

# Post/Community Feed Models
class PostBase(BaseModel):
    title: str
    content: str
    post_type: str  # announcement, collaboration, question, resource, success_story
    tags: List[str] = []
    
class Post(PostBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    user_name: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    likes: int = 0
    comments: List[Dict[str, Any]] = []
    attachments: List[str] = []

# Resource/Learning Library Models
class ResourceBase(BaseModel):
    title: str
    description: str
    resource_type: str  # video, article, course, template, tool, podcast
    category: str  # business_planning, marketing, finance, legal, technology
    url: Optional[str] = None
    content: Optional[str] = None
    tags: List[str] = []
    
class Resource(ResourceBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    views: int = 0
    downloads: int = 0
    featured: bool = False

# AI Chat Models
class ChatMessage(BaseModel):
    role: str  # user or assistant
    content: str

class ChatRequest(BaseModel):
    message: str
    conversation_history: List[ChatMessage] = []
    context_type: str = "general"  # general, business_planning, grants, legal, marketing

class ChatResponse(BaseModel):
    response: str
    conversation_id: Optional[str] = None

# Grant/Funding Models
class GrantBase(BaseModel):
    title: str
    organization: str
    description: str
    amount_range: str
    eligibility: List[str]
    deadline: datetime
    application_link: str
    categories: List[str] = []

class Grant(GrantBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    is_active: bool = True

# Blessing/Gratitude Models
class BlessingBase(BaseModel):
    name: str = "Anonymous"
    blessing: str
    is_anonymous: bool = False

class Blessing(BlessingBase):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ==================== HELPER FUNCTIONS ====================

def hash_password(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, JWT_SECRET, algorithm=JWT_ALGORITHM)
    return encoded_jwt

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        token = credentials.credentials
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid authentication credentials")
        return user_id
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# ==================== ROUTES ====================

@api_router.get("/")
async def root():
    return {"message": "Welcome to The DowUrk FramewUrk API", "version": "1.0.0"}

# Auth Routes
@api_router.post("/auth/register", response_model=Dict[str, Any])
async def register(user_data: UserCreate):
    # Check if user exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create user
    user = User(**user_data.model_dump(exclude={"password"}))
    doc = user.model_dump()
    doc['password'] = hash_password(user_data.password)
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.users.insert_one(doc)
    
    # Create token
    access_token = create_access_token({"sub": user.id})
    
    return {
        "user": user.model_dump(),
        "access_token": access_token,
        "token_type": "bearer"
    }

@api_router.post("/auth/login", response_model=Dict[str, Any])
async def login(credentials: UserLogin):
    user = await db.users.find_one({"email": credentials.email}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    if not verify_password(credentials.password, user['password']):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    
    access_token = create_access_token({"sub": user['id']})
    
    # Remove password from response
    user.pop('password', None)
    
    return {
        "user": user,
        "access_token": access_token,
        "token_type": "bearer"
    }

# Business Routes
@api_router.post("/businesses", response_model=Business)
async def create_business(business_data: BusinessBase, user_id: str = Depends(get_current_user)):
    business = Business(**business_data.model_dump(), user_id=user_id)
    doc = business.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['updated_at'] = doc['updated_at'].isoformat()
    
    await db.businesses.insert_one(doc)
    return business

@api_router.get("/businesses", response_model=List[Business])
async def get_businesses(category: Optional[str] = None, city: Optional[str] = None, 
                        parish: Optional[str] = None, search: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if city:
        query['city'] = city
    if parish:
        query['parish'] = parish
    if search:
        query['$or'] = [
            {'business_name': {'$regex': search, '$options': 'i'}},
            {'description': {'$regex': search, '$options': 'i'}}
        ]
    
    businesses = await db.businesses.find(query, {"_id": 0}).to_list(1000)
    for biz in businesses:
        if isinstance(biz.get('created_at'), str):
            biz['created_at'] = datetime.fromisoformat(biz['created_at'])
        if isinstance(biz.get('updated_at'), str):
            biz['updated_at'] = datetime.fromisoformat(biz['updated_at'])
    return businesses

@api_router.get("/businesses/{business_id}", response_model=Business)
async def get_business(business_id: str):
    business = await db.businesses.find_one({"id": business_id}, {"_id": 0})
    if not business:
        raise HTTPException(status_code=404, detail="Business not found")
    if isinstance(business.get('created_at'), str):
        business['created_at'] = datetime.fromisoformat(business['created_at'])
    if isinstance(business.get('updated_at'), str):
        business['updated_at'] = datetime.fromisoformat(business['updated_at'])
    return business

# Event Routes
@api_router.post("/events", response_model=Event)
async def create_event(event_data: EventBase, user_id: str = Depends(get_current_user)):
    event = Event(**event_data.model_dump())
    doc = event.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    doc['start_time'] = doc['start_time'].isoformat()
    doc['end_time'] = doc['end_time'].isoformat()
    
    await db.events.insert_one(doc)
    return event

@api_router.get("/events", response_model=List[Event])
async def get_events(event_type: Optional[str] = None, upcoming: bool = True):
    query = {}
    if event_type:
        query['event_type'] = event_type
    if upcoming:
        query['start_time'] = {'$gte': datetime.now(timezone.utc).isoformat()}
    
    events = await db.events.find(query, {"_id": 0}).sort('start_time', 1).to_list(1000)
    for event in events:
        if isinstance(event.get('created_at'), str):
            event['created_at'] = datetime.fromisoformat(event['created_at'])
        if isinstance(event.get('start_time'), str):
            event['start_time'] = datetime.fromisoformat(event['start_time'])
        if isinstance(event.get('end_time'), str):
            event['end_time'] = datetime.fromisoformat(event['end_time'])
    return events

# Community Feed Routes
@api_router.post("/posts", response_model=Post)
async def create_post(post_data: PostBase, user_id: str = Depends(get_current_user)):
    # Get user info
    user = await db.users.find_one({"id": user_id}, {"_id": 0})
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    post = Post(**post_data.model_dump(), user_id=user_id, user_name=user['full_name'])
    doc = post.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.posts.insert_one(doc)
    return post

@api_router.get("/posts", response_model=List[Post])
async def get_posts(post_type: Optional[str] = None, limit: int = 50):
    query = {}
    if post_type:
        query['post_type'] = post_type
    
    posts = await db.posts.find(query, {"_id": 0}).sort('created_at', -1).limit(limit).to_list(limit)
    for post in posts:
        if isinstance(post.get('created_at'), str):
            post['created_at'] = datetime.fromisoformat(post['created_at'])
    return posts

# Resources Routes
@api_router.get("/resources", response_model=List[Resource])
async def get_resources(category: Optional[str] = None, resource_type: Optional[str] = None):
    query = {}
    if category:
        query['category'] = category
    if resource_type:
        query['resource_type'] = resource_type
    
    resources = await db.resources.find(query, {"_id": 0}).to_list(1000)
    for resource in resources:
        if isinstance(resource.get('created_at'), str):
            resource['created_at'] = datetime.fromisoformat(resource['created_at'])
    return resources

# Grants Routes
@api_router.get("/grants", response_model=List[Grant])
async def get_grants(category: Optional[str] = None, active_only: bool = True):
    query = {}
    if active_only:
        query['is_active'] = True
        query['deadline'] = {'$gte': datetime.now(timezone.utc).isoformat()}
    if category:
        query['categories'] = category
    
    grants = await db.grants.find(query, {"_id": 0}).sort('deadline', 1).to_list(1000)
    for grant in grants:
        if isinstance(grant.get('created_at'), str):
            grant['created_at'] = datetime.fromisoformat(grant['created_at'])
        if isinstance(grant.get('deadline'), str):
            grant['deadline'] = datetime.fromisoformat(grant['deadline'])
    return grants

# AI Chat Route
@api_router.post("/ai/chat", response_model=ChatResponse)
async def ai_chat(chat_request: ChatRequest):
    from ai_service import generate_ai_response
    
    response_text = await generate_ai_response(
        user_message=chat_request.message,
        conversation_history=[msg.model_dump() for msg in chat_request.conversation_history],
        context_type=chat_request.context_type
    )
    
    return ChatResponse(
        response=response_text,
        conversation_id=str(uuid.uuid4())
    )

# AI Business Plan Generation
@api_router.post("/ai/business-plan")
async def generate_business_plan(business_idea: str, industry: str):
    from ai_service import generate_business_plan_outline
    
    plan = await generate_business_plan_outline(business_idea, industry)
    return plan

# AI Grant Analysis
@api_router.post("/ai/grant-analysis")
async def analyze_grant(business_description: str, grant_criteria: List[str]):
    from ai_service import analyze_grant_eligibility
    
    analysis = await analyze_grant_eligibility(business_description, grant_criteria)
    return analysis

# AI Marketing Content Generation
@api_router.post("/ai/marketing-content")
async def create_marketing_content(business_name: str, business_description: str, content_type: str):
    from ai_service import generate_marketing_content
    
    content = await generate_marketing_content(business_name, business_description, content_type)
    return {"content": content}

# Blessings/Gratitude Wall Routes
@api_router.post("/blessings", response_model=Blessing)
async def create_blessing(blessing_data: BlessingBase, request: Request):
    from rate_limit_helper import check_rate_limit
    
    # Rate limiting: 1 blessing per 5 minutes per IP
    client_ip = request.client.host
    if not check_rate_limit(client_ip, limit_minutes=5):
        raise HTTPException(
            status_code=429, 
            detail="Please wait 5 minutes between blessing submissions"
        )
    
    # Validate word count (approximate)
    word_count = len(blessing_data.blessing.split())
    if word_count > 300:
        raise HTTPException(status_code=400, detail="Blessing must be 300 words or less")
    
    blessing = Blessing(**blessing_data.model_dump())
    doc = blessing.model_dump()
    doc['created_at'] = doc['created_at'].isoformat()
    
    await db.blessings.insert_one(doc)
    return blessing

@api_router.get("/blessings")
async def get_blessings():
    total = await db.blessings.count_documents({})
    blessings = await db.blessings.find({}, {"_id": 0}).sort("created_at", -1).limit(50).to_list(50)
    
    for blessing in blessings:
        if isinstance(blessing.get('created_at'), str):
            blessing['created_at'] = datetime.fromisoformat(blessing['created_at'])
    
    return {"total": total, "blessings": blessings}

# Include routers
app.include_router(api_router)

# Include AI Hub router
from ai_hub_routes import ai_hub_router
app.include_router(ai_hub_router)

# Include Louisiana SOS router
from la_sos_routes import la_sos_router
app.include_router(la_sos_router)

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("shutdown")
async def shutdown_db_client():
    client.close()
