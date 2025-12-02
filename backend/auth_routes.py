"""
Authentication Routes for DowUrk AI
Implements user registration, login, logout with JWT tokens
"""
from fastapi import APIRouter, Depends, HTTPException, status, Request
from pydantic import BaseModel, EmailStr, Field
from typing import Optional
from datetime import datetime, timezone
import uuid

# Import security modules
from security.auth import (
    PasswordValidator, PasswordHasher, TokenManager,
    get_current_user, get_current_active_user
)
from security.rate_limiter import auth_rate_limiter
from security.input_validator import InputValidator, XSSPrevention
from security.audit_logger import audit_logger, AuditEventType

# Database - will be injected
from server import db

router = APIRouter(prefix="/api/auth", tags=["authentication"])

# ========================================
# MODELS
# ========================================

class UserRegister(BaseModel):
    """User registration request"""
    email: EmailStr
    password: str
    full_name: str
    company_name: Optional[str] = None
    organization_type: str = Field(default="business", description="business, nonprofit, or individual")
    industry: Optional[str] = None

class UserLogin(BaseModel):
    """User login request"""
    email: EmailStr
    password: str

class TokenResponse(BaseModel):
    """JWT token response"""
    access_token: str
    refresh_token: str
    token_type: str = "bearer"
    expires_in: int = 900  # 15 minutes
    user: dict

class UserProfile(BaseModel):
    """User profile response"""
    id: str
    email: EmailStr
    full_name: str
    company_name: Optional[str] = None
    organization_type: str
    industry: Optional[str] = None
    role: str = "free"  # free, professional, business, enterprise
    subscription_status: str = "active"
    is_active: bool = True
    created_at: datetime
    last_login: Optional[datetime] = None

class PasswordChange(BaseModel):
    """Password change request"""
    current_password: str
    new_password: str

# ========================================
# ROUTES
# ========================================

@router.post("/register", response_model=TokenResponse, status_code=status.HTTP_201_CREATED)
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
    full_name = XSSPrevention.sanitize(user_data.full_name)
    company_name = XSSPrevention.sanitize(user_data.company_name) if user_data.company_name else None
    
    # Check if user already exists
    existing_user = await db.users.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )
    
    # Hash password
    hashed_password = PasswordHasher.hash_password(user_data.password)
    
    # Create user document
    user_id = str(uuid.uuid4())
    now = datetime.now(timezone.utc)
    
    user_doc = {
        "id": user_id,
        "email": user_data.email,
        "full_name": full_name,
        "company_name": company_name,
        "organization_type": user_data.organization_type,
        "industry": user_data.industry,
        "hashed_password": hashed_password,
        "role": "free",
        "subscription_status": "active",
        "is_active": True,
        "created_at": now.isoformat(),
        "last_login": None,
        "onboarding_completed": False
    }
    
    await db.users.insert_one(user_doc)
    
    # Create tokens
    token_data = {"user_id": user_id, "email": user_data.email, "role": "free"}
    access_token = TokenManager.create_access_token(token_data)
    refresh_token = TokenManager.create_refresh_token({"user_id": user_id})
    
    user_profile = {
        "id": user_id,
        "email": user_data.email,
        "full_name": full_name,
        "company_name": company_name,
        "organization_type": user_data.organization_type,
        "role": "free"
    }
    
    return TokenResponse(
        access_token=access_token,
        refresh_token=refresh_token,
        user=user_profile
    )

@router.post("/login", response_model=TokenResponse)
async def login(credentials: UserLogin, request: Request):
    """Login user"""
    await auth_rate_limiter.check_auth_rate_limit(request, "login")
    
    user = await db.users.find_one({"email": credentials.email})
    if not user or not PasswordHasher.verify_password(credentials.password, user['hashed_password']):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Incorrect email or password")
    
    if not user.get('is_active', True):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Account is suspended")
    
    token_data = {"user_id": user['id'], "email": user['email'], "role": user.get('role', 'free')}
    access_token = TokenManager.create_access_token(token_data)
    refresh_token = TokenManager.create_refresh_token({"user_id": user['id']})
    
    await db.users.update_one({"id": user['id']}, {"$set": {"last_login": datetime.now(timezone.utc).isoformat()}})
    
    user_profile = {"id": user['id'], "email": user['email'], "full_name": user.get('full_name'), "role": user.get('role', 'free')}
    
    return TokenResponse(access_token=access_token, refresh_token=refresh_token, user=user_profile)

@router.get("/me", response_model=UserProfile)
async def get_current_user_profile(current_user: dict = Depends(get_current_active_user)):
    """Get current user profile"""
    user = await db.users.find_one({"id": current_user['user_id']}, {"_id": 0, "hashed_password": 0})
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")
    
    if isinstance(user.get('created_at'), str):
        user['created_at'] = datetime.fromisoformat(user['created_at'])
    if isinstance(user.get('last_login'), str):
        user['last_login'] = datetime.fromisoformat(user['last_login'])
    
    return UserProfile(**user)

@router.post("/logout")
async def logout(request: Request, current_user: dict = Depends(get_current_user)):
    """Logout"""
    audit_logger.log_event(AuditEventType.LOGOUT, user_id=current_user['user_id'], ip_address=request.client.host)
    return {"message": "Successfully logged out"}
