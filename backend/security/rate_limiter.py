"""Rate Limiting Implementation"""
from datetime import datetime, timedelta
from typing import Dict, Optional
from fastapi import HTTPException, Request, status
from collections import defaultdict
import asyncio

class TokenBucket:
    """Token bucket algorithm for rate limiting"""
    
    def __init__(self, capacity: int, refill_rate: float):
        """
        Args:
            capacity: Maximum number of tokens
            refill_rate: Tokens added per second
        """
        self.capacity = capacity
        self.refill_rate = refill_rate
        self.tokens = capacity
        self.last_refill = datetime.now()
    
    def consume(self, tokens: int = 1) -> bool:
        """Try to consume tokens from bucket"""
        self._refill()
        
        if self.tokens >= tokens:
            self.tokens -= tokens
            return True
        return False
    
    def _refill(self):
        """Refill tokens based on time elapsed"""
        now = datetime.now()
        time_passed = (now - self.last_refill).total_seconds()
        tokens_to_add = time_passed * self.refill_rate
        
        self.tokens = min(self.capacity, self.tokens + tokens_to_add)
        self.last_refill = now
    
    def get_wait_time(self) -> float:
        """Get time to wait before next token available"""
        self._refill()
        if self.tokens >= 1:
            return 0
        return (1 - self.tokens) / self.refill_rate

class RateLimiter:
    """Global rate limiter with per-user and per-IP tracking"""
    
    def __init__(self):
        self.buckets: Dict[str, TokenBucket] = {}
        self.cleanup_task: Optional[asyncio.Task] = None
    
    def get_rate_limit_config(self, user_role: str) -> tuple[int, float]:
        """Get rate limit configuration based on user role
        
        Returns:
            (capacity, refill_rate) tuple
            capacity: max requests per minute
            refill_rate: requests per second
        """
        configs = {
            "anonymous": (10, 10/60),    # 10 per minute
            "free": (60, 60/60),          # 60 per minute
            "professional": (120, 120/60), # 120 per minute
            "business": (300, 300/60),    # 300 per minute
            "enterprise": (1000, 1000/60), # 1000 per minute
            "admin": (10000, 10000/60)    # Effectively unlimited
        }
        return configs.get(user_role, configs["anonymous"])
    
    def get_bucket(self, identifier: str, user_role: str) -> TokenBucket:
        """Get or create token bucket for identifier"""
        if identifier not in self.buckets:
            capacity, refill_rate = self.get_rate_limit_config(user_role)
            self.buckets[identifier] = TokenBucket(capacity, refill_rate)
        return self.buckets[identifier]
    
    async def check_rate_limit(self, request: Request, user_role: str = "anonymous", user_id: Optional[str] = None):
        """Check if request is within rate limits"""
        # Use user_id if authenticated, otherwise use IP
        identifier = user_id if user_id else request.client.host
        
        bucket = self.get_bucket(identifier, user_role)
        
        if not bucket.consume():
            wait_time = int(bucket.get_wait_time())
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail="Rate limit exceeded. Please try again later.",
                headers={
                    "X-RateLimit-Limit": str(bucket.capacity),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int((datetime.now() + timedelta(seconds=wait_time)).timestamp())),
                    "Retry-After": str(wait_time)
                }
            )
        
        # Add rate limit headers to response
        return {
            "X-RateLimit-Limit": str(int(bucket.capacity)),
            "X-RateLimit-Remaining": str(int(bucket.tokens)),
            "X-RateLimit-Reset": str(int((datetime.now() + timedelta(seconds=60)).timestamp()))
        }
    
    async def cleanup_old_buckets(self):
        """Periodically clean up old buckets to prevent memory leaks"""
        while True:
            await asyncio.sleep(3600)  # Run every hour
            now = datetime.now()
            to_remove = []
            
            for identifier, bucket in self.buckets.items():
                # Remove buckets inactive for 1 hour
                if (now - bucket.last_refill).total_seconds() > 3600:
                    to_remove.append(identifier)
            
            for identifier in to_remove:
                del self.buckets[identifier]
    
    def start_cleanup(self):
        """Start background cleanup task"""
        if not self.cleanup_task:
            self.cleanup_task = asyncio.create_task(self.cleanup_old_buckets())

# Global rate limiter instance
rate_limiter = RateLimiter()

class SpecialEndpointRateLimiter:
    """Stricter rate limiting for sensitive endpoints"""
    
    def __init__(self):
        self.failed_attempts: Dict[str, list] = defaultdict(list)
    
    async def check_auth_rate_limit(self, request: Request, endpoint: str):
        """Rate limit for authentication endpoints
        
        - /auth/login: 5 attempts per 15 minutes
        - /auth/register: 3 attempts per hour
        - /auth/reset-password: 3 attempts per hour
        """
        identifier = request.client.host
        now = datetime.now()
        
        # Clean old attempts
        cutoff_time = now - timedelta(minutes=60)
        self.failed_attempts[identifier] = [
            attempt for attempt in self.failed_attempts[identifier]
            if attempt > cutoff_time
        ]
        
        # Check limits based on endpoint
        limits = {
            "login": (5, 15),      # 5 attempts per 15 minutes
            "register": (3, 60),   # 3 attempts per hour
            "reset-password": (3, 60)  # 3 attempts per hour
        }
        
        max_attempts, window_minutes = limits.get(endpoint, (5, 15))
        window_cutoff = now - timedelta(minutes=window_minutes)
        
        recent_attempts = [
            attempt for attempt in self.failed_attempts[identifier]
            if attempt > window_cutoff
        ]
        
        if len(recent_attempts) >= max_attempts:
            raise HTTPException(
                status_code=status.HTTP_429_TOO_MANY_REQUESTS,
                detail=f"Too many attempts. Please try again in {window_minutes} minutes.",
                headers={"Retry-After": str(window_minutes * 60)}
            )
    
    def record_failed_attempt(self, request: Request):
        """Record a failed authentication attempt"""
        identifier = request.client.host
        self.failed_attempts[identifier].append(datetime.now())

# Global special rate limiter
auth_rate_limiter = SpecialEndpointRateLimiter()
