"""
Security Dependencies for FastAPI routes
Provides reusable dependency functions for authentication, rate limiting, and validation
"""
from fastapi import Depends, HTTPException, Request, status
from typing import Optional
from .rate_limiter import rate_limiter
from .auth import get_current_user, get_current_active_user
from .input_validator import InputValidator, XSSPrevention, SQLInjectionPrevention
import logging

logger = logging.getLogger(__name__)

async def apply_rate_limit(
    request: Request,
    current_user: Optional[dict] = Depends(get_current_user)
) -> dict:
    """
    Global rate limiting dependency
    Apply to any route to enforce rate limits based on user role
    """
    user_role = "anonymous"
    user_id = None
    
    if current_user:
        user_role = current_user.get('role', 'free')
        user_id = current_user.get('user_id')
    
    return await rate_limiter.check_rate_limit(
        request=request,
        user_role=user_role,
        user_id=user_id
    )

async def require_authentication(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """
    Require authenticated user
    Raises 401 if not authenticated
    """
    return current_user

async def require_pro_tier(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """
    Require Professional tier or higher
    """
    allowed_roles = ["professional", "business", "enterprise", "admin"]
    user_role = current_user.get('role', 'free')
    
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires Professional tier or higher"
        )
    
    return current_user

async def require_business_tier(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """
    Require Business tier or higher
    """
    allowed_roles = ["business", "enterprise", "admin"]
    user_role = current_user.get('role', 'free')
    
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires Business tier or higher"
        )
    
    return current_user

async def require_enterprise_tier(
    current_user: dict = Depends(get_current_active_user)
) -> dict:
    """
    Require Enterprise tier
    """
    allowed_roles = ["enterprise", "admin"]
    user_role = current_user.get('role', 'free')
    
    if user_role not in allowed_roles:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="This feature requires Enterprise tier"
        )
    
    return current_user

def validate_business_input(field_name: str, value: str) -> str:
    """
    Validate and sanitize business-related input
    """
    # Check for SQL injection
    SQL injection Prevention.validate_input(value, field_name)
    
    # Sanitize XSS
    sanitized = XSSPrevention.sanitize(value)
    
    return sanitized

def validate_user_content(content: str, max_length: int = 5000) -> str:
    """
    Validate and sanitize user-generated content
    """
    if len(content) > max_length:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Content exceeds maximum length of {max_length} characters"
        )
    
    # Sanitize for XSS
    return XSSPrevention.sanitize(content)
