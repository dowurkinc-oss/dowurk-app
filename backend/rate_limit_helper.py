from datetime import datetime, timezone, timedelta
from typing import Dict

# Simple in-memory rate limiter (for production, use Redis)
blessing_submissions: Dict[str, datetime] = {}

def check_rate_limit(ip_address: str, limit_minutes: int = 5) -> bool:
    """Check if IP can submit (max 1 per 5 minutes)"""
    now = datetime.now(timezone.utc)
    
    if ip_address in blessing_submissions:
        last_submit = blessing_submissions[ip_address]
        if now - last_submit < timedelta(minutes=limit_minutes):
            return False
    
    blessing_submissions[ip_address] = now
    return True

def cleanup_old_entries():
    """Clean up entries older than 1 hour"""
    now = datetime.now(timezone.utc)
    cutoff = now - timedelta(hours=1)
    
    to_remove = [ip for ip, time in blessing_submissions.items() if time < cutoff]
    for ip in to_remove:
        del blessing_submissions[ip]
