"""
DowUrk AI Server with Security Features Integrated
This is an EXAMPLE implementation showing how to integrate all security features.

To use this:
1. Review the security features
2. Integrate them into your actual server.py
3. Update environment variables with proper secrets
4. Test thoroughly before production deployment
"""
from fastapi import FastAPI, APIRouter, Depends, HTTPException, status, Request
from fastapi.responses import JSONResponse
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict, EmailStr
from typing import List, Optional
import uuid
from datetime import datetime, timezone

# Import security modules
from security.auth import (
    PasswordValidator, PasswordHasher, TokenManager,
    get_current_user, get_current_active_user,
    require_admin, require_professional
)
from security.rate_limiter import rate_limiter, auth_rate_limiter
from security.input_validator import InputValidator, SQLInjectionPrevention, XSSPrevention
from security.audit_logger import audit_logger, AuditEventType
from security.encryption import field_encryptor, PIIProtector
from security.middleware import (
    SecurityHeadersMiddleware,
    RequestLoggingMiddleware,
    RateLimitMiddleware
)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# MongoDB connection
mongo_url = os.environ['MONGO_URL']
client = AsyncIOMotorClient(mongo_url)
db = client[os.environ['DB_NAME']]

# Create the main app
app = FastAPI(title="DowUrk AI API", version="1.0.0")

# Add security middleware
app.add_middleware(SecurityHeadersMiddleware)
app.add_middleware(RequestLoggingMiddleware)
app.add_middleware(RateLimitMiddleware)

# Create API router
api_router = APIRouter(prefix="/api")

# ========================================
# MODELS
# ========================================

class UserRegister(BaseModel):
    email: EmailStr
    password: str
    full_name: str
    company_name: Optional[str] = None

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes

class User(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    email: EmailStr
    full_name: str
    company_name: Optional[str] = None
    role: str = "free"  # free, professional, business, enterprise, admin
    is_active: bool = True
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    last_login: Optional[datetime] = None

class BusinessPlan(BaseModel):
    model_config = ConfigDict(extra="ignore")
    
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    user_id: str
    business_name: str = Field(..., min_length=1, max_length=200)
    industry: str
    description: str = Field(..., max_length=5000)
    target_market: str
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    updated_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ========================================
# AUTHENTICATION ENDPOINTS
# ========================================

@api_router.post("/auth/register", response_model=User, status_code=status.HTTP_201_CREATED)
async def register(user_data: UserRegister, request: Request):
    """Register a new user"""
    
    # Rate limiting for registration
    await auth_rate_limiter.check_auth_rate_limit(request, "register")
    
    # Validate email
    if not InputValidator.validate_email(user_data.email):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Invalid email format"
        )
    
    # Validate password strength
    is_valid, message = PasswordValidator.validate(user_data.password)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Sanitize inputs
    full_name = InputValidator.sanitize_html(user_data.full_name)
    company_name = InputValidator.sanitize_html(user_data.company_name) if user_data.company_name else None
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        # Log failed attempt
        audit_logger.log_authentication(
            event_type=AuditEventType.LOGIN_FAILURE,
            user_email=user_data.email,
            ip_address=request.client.host,
            success=False,
            metadata={"reason": "Email already registered"}
        )
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = PasswordHasher.hash_password(user_data.password)
    
    # Create user
    user = User(
        email=user_data.email,
        full_name=full_name,
        company_name=company_name
    )
    
    user_dict = user.model_dump()
    user_dict['hashed_password'] = hashed_password
    user_dict['created_at'] = user_dict['created_at'].isoformat()
    
    await db.users.insert_one(user_dict)
    
    # Log successful registration
    audit_logger.log_event(
        event_type=AuditEventType.USER_CREATED,
        user_email=user_data.email,
        ip_address=request.client.host,
        metadata={"registration_method": "email"}
    )
    
    return user

@api_router.post("/auth/login", response_model=TokenResponse)
async def login(credentials: UserLogin, request: Request):
    """Login and receive tokens"""
    
    # Rate limiting for login
    await auth_rate_limiter.check_auth_rate_limit(request, "login")
    
    # Find user
    user = await db.users.find_one({"email": credentials.email})
    
    if not user or not PasswordHasher.verify_password(credentials.password, user['hashed_password']):
        # Log failed attempt
        auth_rate_limiter.record_failed_attempt(request)
        audit_logger.log_authentication(
            event_type=AuditEventType.LOGIN_FAILURE,
            user_email=credentials.email,
            ip_address=request.client.host,
            success=False,
            metadata={"reason": "Invalid credentials"}
        )
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password"
        )
    
    # Check if user is active
    if not user.get('is_active', True):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Account is suspended"
        )
    
    # Create tokens
    token_data = {
        "user_id": user['id'],
        "email": user['email'],
        "role": user.get('role', 'free')
    }
    
    access_token = TokenManager.create_access_token(token_data)
    refresh_token = TokenManager.create_refresh_token({"user_id": user['id']})
    
    # Update last login
    await db.users.update_one(
        {"id": user['id']},
        {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}}
    )
    
    # Log successful login
    audit_logger.log_authentication(
        event_type=AuditEventType.LOGIN_SUCCESS,
        user_email=credentials.email,
        ip_address=request.client.host,
        success=True,
        metadata={"user_agent": request.headers.get("user-agent")}
    )
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token
    )

@api_router.post("/auth/logout")
async def logout(request: Request, current_user: dict = Depends(get_current_user)):
    """Logout (client should discard tokens)"""
    
    # Log logout
    audit_logger.log_event(
        event_type=AuditEventType.LOGOUT,
        user_id=current_user['user_id'],
        user_email=current_user['email'],
        ip_address=request.client.host
    )
    
    return {"message": "Successfully logged out"}

# ========================================
# BUSINESS PLAN ENDPOINTS (Protected)
# ========================================

@api_router.post("/business-plans", response_model=BusinessPlan, dependencies=[Depends(require_professional)])
async def create_business_plan(
    plan_data: BusinessPlan,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Create a new business plan (requires Professional tier)"""
    
    # Validate business name
    is_valid, message = InputValidator.validate_business_name(plan_data.business_name)
    if not is_valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=message
        )
    
    # Sanitize inputs
    plan_data.business_name = XSSPrevention.sanitize(plan_data.business_name)
    plan_data.description = XSSPrevention.sanitize(plan_data.description)
    
    # Check for SQL injection attempts
    SQLInjectionPrevention.validate_input(plan_data.business_name, "business_name")
    
    # Set user_id from authenticated user
    plan_data.user_id = current_user['user_id']
    
    # Save to database
    plan_dict = plan_data.model_dump()
    plan_dict['created_at'] = plan_dict['created_at'].isoformat()
    plan_dict['updated_at'] = plan_dict['updated_at'].isoformat()
    
    await db.business_plans.insert_one(plan_dict)
    
    # Log data creation
    audit_logger.log_event(
        event_type=AuditEventType.DATA_CREATE,
        user_id=current_user['user_id'],
        ip_address=request.client.host,
        resource_type="business_plan",
        resource_id=plan_data.id,
        action="create"
    )
    
    return plan_data

@api_router.get("/business-plans", response_model=List[BusinessPlan])
async def get_business_plans(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Get all business plans for current user"""
    
    # Fetch user's business plans
    plans = await db.business_plans.find(
        {"user_id": current_user['user_id']},
        {"_id": 0}
    ).to_list(100)
    
    # Convert ISO strings back to datetime
    for plan in plans:
        if isinstance(plan.get('created_at'), str):
            plan['created_at'] = datetime.fromisoformat(plan['created_at'])
        if isinstance(plan.get('updated_at'), str):
            plan['updated_at'] = datetime.fromisoformat(plan['updated_at'])
    
    # Log data access
    audit_logger.log_data_access(
        user_id=current_user['user_id'],
        resource_type="business_plan",
        resource_id="list",
        action="read",
        ip_address=request.client.host
    )
    
    return plans

@api_router.get("/business-plans/{plan_id}", response_model=BusinessPlan)
async def get_business_plan(
    plan_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Get a specific business plan"""
    
    plan = await db.business_plans.find_one(
        {"id": plan_id, "user_id": current_user['user_id']},
        {"_id": 0}
    )
    
    if not plan:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business plan not found"
        )
    
    # Convert ISO strings to datetime
    if isinstance(plan.get('created_at'), str):
        plan['created_at'] = datetime.fromisoformat(plan['created_at'])
    if isinstance(plan.get('updated_at'), str):
        plan['updated_at'] = datetime.fromisoformat(plan['updated_at'])
    
    # Log data access
    audit_logger.log_data_access(
        user_id=current_user['user_id'],
        resource_type="business_plan",
        resource_id=plan_id,
        action="read",
        ip_address=request.client.host
    )
    
    return plan

@api_router.delete("/business-plans/{plan_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_business_plan(
    plan_id: str,
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Delete a business plan"""
    
    result = await db.business_plans.delete_one(
        {"id": plan_id, "user_id": current_user['user_id']}
    )
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Business plan not found"
        )
    
    # Log data deletion
    audit_logger.log_event(
        event_type=AuditEventType.DATA_DELETE,
        user_id=current_user['user_id'],
        ip_address=request.client.host,
        resource_type="business_plan",
        resource_id=plan_id,
        action="delete"
    )
    
    return None

# ========================================
# ADMIN ENDPOINTS
# ========================================

@api_router.get("/admin/users", dependencies=[Depends(require_admin)])
async def get_all_users(
    request: Request,
    current_user: dict = Depends(get_current_user)
):
    """Get all users (admin only)"""
    
    users = await db.users.find({}, {"_id": 0, "hashed_password": 0}).to_list(1000)
    
    # Log admin action
    audit_logger.log_admin_action(
        admin_id=current_user['user_id'],
        action="list_users",
        target_user_id="all",
        ip_address=request.client.host
    )
    
    return {"users": users}

# ========================================
# HEALTH CHECK
# ========================================

@api_router.get("/health")
async def health_check():
    """Health check endpoint (no auth required)"""
    return {
        "status": "healthy",
        "timestamp": datetime.now(timezone.utc).isoformat()
    }

# Include router in app
app.include_router(api_router)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

@app.on_event("startup")
async def startup_event():
    """Run on application startup"""
    logger.info("DowUrk AI API starting up...")
    
    # Start rate limiter cleanup task
    rate_limiter.start_cleanup()
    
    # Create indexes for better query performance
    await db.users.create_index("email", unique=True)
    await db.users.create_index("id", unique=True)
    await db.business_plans.create_index("user_id")
    await db.business_plans.create_index("id", unique=True)
    
    logger.info("Database indexes created")
    logger.info("DowUrk AI API ready!")

@app.on_event("shutdown")
async def shutdown_event():
    """Run on application shutdown"""
    logger.info("DowUrk AI API shutting down...")
    client.close()
    logger.info("Database connections closed")

# Custom exception handlers
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    """Custom HTTP exception handler"""
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error": exc.detail,
            "request_id": getattr(request.state, "request_id", None)
        },
        headers=exc.headers
    )

@app.exception_handler(Exception)
async def general_exception_handler(request: Request, exc: Exception):
    """Handle unexpected errors"""
    logger.error(f"Unexpected error: {str(exc)}", exc_info=True)
    
    # Log security incident
    audit_logger.log_event(
        event_type=AuditEventType.SECURITY_BREACH_DETECTED,
        ip_address=request.client.host,
        metadata={
            "error": str(exc),
            "path": request.url.path,
            "request_id": getattr(request.state, "request_id", None)
        }
    )
    
    return JSONResponse(
        status_code=500,
        content={
            "error": "Internal server error",
            "request_id": getattr(request.state, "request_id", None)
        }
    )
