"""Authentication and Authorization Module"""
from datetime import datetime, timedelta, timezone
from typing import Optional
from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from jose import JWTError, jwt
from passlib.context import CryptContext
import os

# Security configurations
SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'your-secret-key-change-in-production')
REFRESH_SECRET_KEY = os.environ.get('JWT_REFRESH_SECRET_KEY', 'your-refresh-secret-key-change-in-production')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 15
REFRESH_TOKEN_EXPIRE_DAYS = 7

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# HTTP Bearer for token authentication
security = HTTPBearer()

class PasswordValidator:
    """Validate password strength"""
    
    @staticmethod
    def validate(password: str) -> tuple[bool, str]:
        """Validate password meets requirements"""
        if len(password) < 12:
            return False, "Password must be at least 12 characters"
        
        if not any(c.isupper() for c in password):
            return False, "Password must contain at least one uppercase letter"
        
        if not any(c.islower() for c in password):
            return False, "Password must contain at least one lowercase letter"
        
        if not any(c.isdigit() for c in password):
            return False, "Password must contain at least one number"
        
        if not any(c in '!@#$%^&*()_+-=[]{}|;:,.<>?' for c in password):
            return False, "Password must contain at least one special character"
        
        # Check against common passwords (basic list)
        common_passwords = ['password123!', 'Welcome123!', 'Admin123!', 'Password1!']
        if password in common_passwords:
            return False, "Password is too common, please choose a stronger password"
        
        return True, "Password is valid"

class PasswordHasher:
    """Handle password hashing and verification"""
    
    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password with bcrypt"""
        return pwd_context.hash(password)
    
    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify a password against its hash"""
        return pwd_context.verify(plain_password, hashed_password)

class TokenManager:
    """Manage JWT tokens"""
    
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
        """Create access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        
        to_encode.update({"exp": expire, "type": "access"})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def create_refresh_token(data: dict) -> str:
        """Create refresh token"""
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + timedelta(days=REFRESH_TOKEN_EXPIRE_DAYS)
        to_encode.update({"exp": expire, "type": "refresh"})
        encoded_jwt = jwt.encode(to_encode, REFRESH_SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt
    
    @staticmethod
    def decode_access_token(token: str) -> dict:
        """Decode and validate access token"""
        try:
            payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "access":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials",
                headers={"WWW-Authenticate": "Bearer"},
            )
    
    @staticmethod
    def decode_refresh_token(token: str) -> dict:
        """Decode and validate refresh token"""
        try:
            payload = jwt.decode(token, REFRESH_SECRET_KEY, algorithms=[ALGORITHM])
            if payload.get("type") != "refresh":
                raise HTTPException(
                    status_code=status.HTTP_401_UNAUTHORIZED,
                    detail="Invalid token type"
                )
            return payload
        except JWTError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate refresh token"
            )

async def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)) -> dict:
    """Get current authenticated user from token"""
    token = credentials.credentials
    payload = TokenManager.decode_access_token(token)
    return payload

async def get_current_active_user(current_user: dict = Depends(get_current_user)) -> dict:
    """Get current active user (can add additional checks here)"""
    # Add checks for user status, subscription, etc.
    return current_user

class RoleChecker:
    """Check user roles and permissions"""
    
    def __init__(self, allowed_roles: list[str]):
        self.allowed_roles = allowed_roles
    
    def __call__(self, current_user: dict = Depends(get_current_user)) -> dict:
        user_role = current_user.get("role", "free")
        if user_role not in self.allowed_roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Access denied. Required roles: {', '.join(self.allowed_roles)}"
            )
        return current_user

# Role-based dependency shortcuts
require_admin = RoleChecker(["admin"])
require_enterprise = RoleChecker(["enterprise", "admin"])
require_business = RoleChecker(["business", "enterprise", "admin"])
require_professional = RoleChecker(["professional", "business", "enterprise", "admin"])
