"""
IP PROTECTION MIDDLEWARE
Request filtering, logging, and protection against scraping

Copyright (c) 2025 DowUrk Inc. All rights reserved.
"""

from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.responses import JSONResponse
from typing import Callable
import time
import hashlib
import logging
from datetime import datetime

logger = logging.getLogger(__name__)

class IPProtectionMiddleware(BaseHTTPMiddleware):
    """
    Comprehensive IP protection middleware.
    Monitors requests, detects suspicious behavior, and protects proprietary endpoints.
    """
    
    # CONFIDENTIAL: Endpoints that contain proprietary information
    PROTECTED_ENDPOINTS = [
        "/api/ai/",  # All AI endpoints contain proprietary prompts
        "/api/monitoring/usage-stats",  # Business intelligence
        "/api/monitoring/alerts",  # System information
    ]
    
    # Public documentation that can be shared
    PUBLIC_DOCS = [
        "IMPLEMENTATION_COMPLETE.md",
        "METRICS_DASHBOARD_GUIDE.md",
    ]
    
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        """
        Process each request with IP protection checks.
        """
        start_time = time.time()
        
        # Log request for audit trail
        await self._log_request(request)
        
        # Check for suspicious behavior
        if await self._is_suspicious(request):
            logger.warning(f"Suspicious request detected: {request.url.path}")
            return JSONResponse(
                status_code=403,
                content={"detail": "Access denied"},
                headers={"X-Reason": "Suspicious activity detected"}
            )
        
        # Block access to proprietary documents
        if await self._is_proprietary_doc_request(request):
            logger.warning(f"Attempt to access proprietary document: {request.url.path}")
            return JSONResponse(
                status_code=403,
                content={"detail": "This document is proprietary and confidential"},
                headers={"X-Reason": "Proprietary content"}
            )
        
        # Process request
        response = await call_next(request)
        
        # Add IP protection headers
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-Powered-By"] = "DowUrk"  # Don't reveal tech stack
        
        # Add copyright notice to AI responses
        if request.url.path.startswith("/api/ai/"):
            response.headers["X-Copyright"] = "© 2025 DowUrk Inc. All rights reserved."
            response.headers["X-License"] = "Proprietary"
        
        # Log response time
        process_time = time.time() - start_time
        response.headers["X-Process-Time"] = str(process_time)
        
        return response
    
    async def _log_request(self, request: Request):
        """
        Log all requests for security audit.
        """
        log_data = {
            "timestamp": datetime.utcnow().isoformat(),
            "path": request.url.path,
            "method": request.method,
            "client_ip": request.client.host if request.client else "unknown",
            "user_agent": request.headers.get("user-agent", "unknown")
        }
        
        # Create request fingerprint
        fingerprint_data = f"{log_data['client_ip']}{log_data['user_agent']}".encode()
        fingerprint = hashlib.sha256(fingerprint_data).hexdigest()[:16]
        log_data["fingerprint"] = fingerprint
        
        logger.info(f"REQUEST: {log_data}")
    
    async def _is_suspicious(self, request: Request) -> bool:
        """
        Detect suspicious requests that might be trying to scrape IP.
        """
        user_agent = request.headers.get("user-agent", "").lower()
        
        # Common scraping tools and bots
        suspicious_agents = [
            "scrapy", "selenium", "puppeteer", "playwright",
            "wget", "curl", "python-requests", "postman",
            "httpie", "insomnia", "bot", "crawler", "spider"
        ]
        
        # Allow legitimate tools in development
        if any(agent in user_agent for agent in suspicious_agents):
            # Check if it's from localhost (development)
            if request.client and request.client.host in ["127.0.0.1", "localhost"]:
                return False  # Allow in development
            
            # In production, block scraping tools
            logger.warning(f"Suspicious user agent: {user_agent}")
            # Temporarily disabled to allow testing
            # return True
        
        return False
    
    async def _is_proprietary_doc_request(self, request: Request) -> bool:
        """
        Check if request is trying to access proprietary documents.
        """
        path = request.url.path
        
        # Block access to strategic/proprietary documents
        proprietary_docs = [
            "FUNDRAISING_STRATEGY.md",
            "COMPETITIVE_ANALYSIS_FRAMEWORK.md",
            "SECURITY_IMPLEMENTATION_GUIDE.md",
            "PRODUCTION_READY_GUIDE.md",
            "POST_LAUNCH_OPTIMIZATION_GUIDE.md",
            "FEATURE_ROADMAP_Q1_2025.md",
            "MVP_ROADMAP.md",
        ]
        
        # Check if trying to access proprietary doc
        for doc in proprietary_docs:
            if doc in path or doc.lower() in path.lower():
                return True
        
        return False


class RateLimitByIPMiddleware(BaseHTTPMiddleware):
    """
    Additional rate limiting based on IP address to prevent scraping.
    """
    
    def __init__(self, app, requests_per_minute: int = 60):
        super().__init__(app)
        self.requests_per_minute = requests_per_minute
        self.request_counts = {}  # In production, use Redis
    
    async def dispatch(
        self, request: Request, call_next: Callable
    ) -> Response:
        """
        Rate limit by IP address.
        """
        client_ip = request.client.host if request.client else "unknown"
        current_minute = int(time.time() / 60)
        key = f"{client_ip}:{current_minute}"
        
        # Count requests
        self.request_counts[key] = self.request_counts.get(key, 0) + 1
        
        # Check limit
        if self.request_counts[key] > self.requests_per_minute:
            logger.warning(f"Rate limit exceeded for IP: {client_ip}")
            return JSONResponse(
                status_code=429,
                content={"detail": "Too many requests. Please slow down."},
                headers={"X-Rate-Limit-Exceeded": "true"}
            )
        
        # Clean old entries (basic cleanup)
        if len(self.request_counts) > 10000:
            self.request_counts = {
                k: v for k, v in self.request_counts.items()
                if int(k.split(':')[1]) >= current_minute - 5
            }
        
        response = await call_next(request)
        return response
