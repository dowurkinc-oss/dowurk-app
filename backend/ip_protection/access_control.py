"""
ACCESS CONTROL - IP PROTECTION
Role-based feature access and IP restrictions

Copyright (c) 2025 DowUrk Inc. All rights reserved.
"""

from fastapi import HTTPException, status, Request
from typing import List, Optional, Dict
import logging

logger = logging.getLogger(__name__)

# CONFIDENTIAL: Feature access matrix by subscription tier
FEATURE_ACCESS_MATRIX = {
    "free": {
        "ai_business_planning": {"enabled": True, "daily_limit": 10},
        "ai_content_generator": {"enabled": True, "daily_limit": 5},
        "ai_pitch_deck": {"enabled": False, "message": "Upgrade to Professional"},
        "team_collaboration": {"enabled": False, "message": "Upgrade to Business"},
        "api_access": {"enabled": False, "message": "Upgrade to Enterprise"},
        "export_pdf": {"enabled": False, "message": "Upgrade to Professional"},
        "custom_branding": {"enabled": False, "message": "Upgrade to Business"},
        "priority_support": {"enabled": False, "message": "Upgrade to Professional"},
        "advanced_analytics": {"enabled": False, "message": "Upgrade to Professional"},
    },
    "professional": {
        "ai_business_planning": {"enabled": True, "daily_limit": 100},
        "ai_content_generator": {"enabled": True, "daily_limit": 50},
        "ai_pitch_deck": {"enabled": True, "daily_limit": 10},
        "team_collaboration": {"enabled": False, "message": "Upgrade to Business"},
        "api_access": {"enabled": False, "message": "Upgrade to Enterprise"},
        "export_pdf": {"enabled": True, "daily_limit": 20},
        "custom_branding": {"enabled": False, "message": "Upgrade to Business"},
        "priority_support": {"enabled": True},
        "advanced_analytics": {"enabled": True},
    },
    "business": {
        "ai_business_planning": {"enabled": True, "daily_limit": 500},
        "ai_content_generator": {"enabled": True, "daily_limit": 200},
        "ai_pitch_deck": {"enabled": True, "daily_limit": 50},
        "team_collaboration": {"enabled": True, "max_team_size": 10},
        "api_access": {"enabled": False, "message": "Upgrade to Enterprise"},
        "export_pdf": {"enabled": True, "unlimited": True},
        "custom_branding": {"enabled": True},
        "priority_support": {"enabled": True},
        "advanced_analytics": {"enabled": True},
    },
    "enterprise": {
        "ai_business_planning": {"enabled": True, "unlimited": True},
        "ai_content_generator": {"enabled": True, "unlimited": True},
        "ai_pitch_deck": {"enabled": True, "unlimited": True},
        "team_collaboration": {"enabled": True, "unlimited": True},
        "api_access": {"enabled": True},
        "export_pdf": {"enabled": True, "unlimited": True},
        "custom_branding": {"enabled": True},
        "priority_support": {"enabled": True, "sla": "4_hours"},
        "advanced_analytics": {"enabled": True},
        "white_label": {"enabled": True},
        "custom_integrations": {"enabled": True},
    }
}

# SECURITY: Admin-only endpoints
ADMIN_ONLY_ENDPOINTS = [
    "/api/admin",
    "/api/monitoring/usage-stats",
    "/api/monitoring/alerts",
]

# SECURITY: Public endpoints (no auth required)
PUBLIC_ENDPOINTS = [
    "/api/",
    "/api/auth/register",
    "/api/auth/login",
    "/api/payments/packages",
    "/api/monitoring/health",
]

class AccessControl:
    """
    Centralized access control for IP protection.
    Enforces feature access based on subscription tier.
    """
    
    @staticmethod
    def check_feature_access(
        feature: str,
        user_role: str,
        user_id: Optional[str] = None
    ) -> Dict:
        """
        Check if user has access to a feature based on subscription tier.
        
        Returns:
            Dict with 'allowed' boolean and optional 'message' or 'limits'
        """
        if user_role not in FEATURE_ACCESS_MATRIX:
            logger.warning(f"Unknown user role: {user_role}")
            return {"allowed": False, "message": "Invalid subscription tier"}
        
        tier_features = FEATURE_ACCESS_MATRIX[user_role]
        
        if feature not in tier_features:
            return {"allowed": False, "message": "Feature not found"}
        
        feature_config = tier_features[feature]
        
        if not feature_config.get("enabled", False):
            return {
                "allowed": False,
                "message": feature_config.get("message", "Feature not available in your tier"),
                "upgrade_required": True
            }
        
        # Feature is enabled - return with limits if any
        return {
            "allowed": True,
            "limits": {
                "daily_limit": feature_config.get("daily_limit"),
                "unlimited": feature_config.get("unlimited", False),
                "max_team_size": feature_config.get("max_team_size"),
            }
        }
    
    @staticmethod
    def require_feature_access(feature: str):
        """
        Decorator to protect endpoints with feature-based access control.
        """
        def decorator(func):
            async def wrapper(*args, **kwargs):
                # Extract user from request
                request = None
                current_user = None
                
                for arg in args:
                    if isinstance(arg, Request):
                        request = arg
                    elif isinstance(arg, dict) and 'role' in arg:
                        current_user = arg
                
                if not current_user:
                    raise HTTPException(
                        status_code=status.HTTP_401_UNAUTHORIZED,
                        detail="Authentication required"
                    )
                
                user_role = current_user.get('role', 'free')
                user_id = current_user.get('id')
                
                # Check access
                access_result = AccessControl.check_feature_access(
                    feature, user_role, user_id
                )
                
                if not access_result['allowed']:
                    raise HTTPException(
                        status_code=status.HTTP_403_FORBIDDEN,
                        detail=access_result.get('message', 'Access denied'),
                        headers={"X-Upgrade-Required": "true"}
                    )
                
                # Add limits to request context
                if request:
                    request.state.feature_limits = access_result.get('limits', {})
                
                return await func(*args, **kwargs)
            
            return wrapper
        return decorator
    
    @staticmethod
    def is_admin_endpoint(path: str) -> bool:
        """
        Check if endpoint requires admin access.
        """
        return any(path.startswith(admin_path) for admin_path in ADMIN_ONLY_ENDPOINTS)
    
    @staticmethod
    def is_public_endpoint(path: str) -> bool:
        """
        Check if endpoint is public (no auth required).
        """
        return any(path.startswith(public_path) for public_path in PUBLIC_ENDPOINTS)

# SECURITY: Usage tracking for rate limiting
class UsageTracker:
    """
    Track feature usage to enforce daily limits.
    Prevents abuse and protects IP from excessive scraping.
    """
    
    def __init__(self, db):
        self.db = db
    
    async def check_daily_limit(
        self,
        user_id: str,
        feature: str,
        limit: Optional[int]
    ) -> bool:
        """
        Check if user has reached daily limit for a feature.
        
        Returns:
            True if user can proceed, False if limit reached
        """
        if limit is None:
            return True  # No limit
        
        # Get today's usage
        from datetime import datetime, timezone
        today = datetime.now(timezone.utc).date()
        
        usage_count = await self.db.feature_usage.count_documents({
            "user_id": user_id,
            "feature": feature,
            "date": today.isoformat()
        })
        
        return usage_count < limit
    
    async def record_usage(
        self,
        user_id: str,
        feature: str,
        metadata: Optional[Dict] = None
    ):
        """
        Record feature usage for tracking and analytics.
        """
        from datetime import datetime, timezone
        
        usage_record = {
            "user_id": user_id,
            "feature": feature,
            "date": datetime.now(timezone.utc).date().isoformat(),
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "metadata": metadata or {}
        }
        
        await self.db.feature_usage.insert_one(usage_record)
        logger.info(f"Usage recorded: user={user_id}, feature={feature}")
