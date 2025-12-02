"""Security Middleware"""
from fastapi import Request, Response
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.types import ASGIApp
from .input_validator import SecurityHeaders
from .audit_logger import audit_logger, AuditEventType
from .rate_limiter import rate_limiter
import time
import uuid

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """Add security headers to all responses"""
    
    async def dispatch(self, request: Request, call_next):
        response = await call_next(request)
        
        # Add all security headers
        headers = SecurityHeaders.get_security_headers()
        for header, value in headers.items():
            response.headers[header] = value
        
        return response

class RequestLoggingMiddleware(BaseHTTPMiddleware):
    """Log all requests for monitoring and debugging"""
    
    async def dispatch(self, request: Request, call_next):
        # Generate request ID
        request_id = str(uuid.uuid4())
        request.state.request_id = request_id
        
        # Log request start
        start_time = time.time()
        
        # Process request
        response = await call_next(request)
        
        # Calculate processing time
        process_time = time.time() - start_time
        
        # Add request ID to response headers
        response.headers["X-Request-ID"] = request_id
        response.headers["X-Process-Time"] = str(process_time)
        
        # Log request completion
        audit_logger.log_event(
            event_type=AuditEventType.DATA_READ,  # Generic event type
            ip_address=request.client.host,
            user_agent=request.headers.get("user-agent"),
            metadata={
                "request_id": request_id,
                "method": request.method,
                "path": request.url.path,
                "status_code": response.status_code,
                "process_time": process_time
            }
        )
        
        return response

class RateLimitMiddleware(BaseHTTPMiddleware):
    """Apply rate limiting to all requests"""
    
    async def dispatch(self, request: Request, call_next):
        # Skip rate limiting for health checks
        if request.url.path in ["/health", "/api/health"]:
            return await call_next(request)
        
        # Get user info if authenticated
        user_role = "anonymous"
        user_id = None
        
        # Try to get user from token (if authentication middleware already ran)
        if hasattr(request.state, "user"):
            user_role = request.state.user.get("role", "anonymous")
            user_id = request.state.user.get("user_id")
        
        # Check rate limit
        try:
            headers = await rate_limiter.check_rate_limit(request, user_role, user_id)
        except Exception as e:
            # Rate limit exceeded - exception already raised
            raise e
        
        # Process request
        response = await call_next(request)
        
        # Add rate limit headers to response
        for header, value in headers.items():
            response.headers[header] = value
        
        return response

class IPBlockingMiddleware(BaseHTTPMiddleware):
    """Block requests from known malicious IPs"""
    
    def __init__(self, app: ASGIApp, blocked_ips: set = None):
        super().__init__(app)
        self.blocked_ips = blocked_ips or set()
        # In production, load from database or external service
    
    async def dispatch(self, request: Request, call_next):
        client_ip = request.client.host
        
        if client_ip in self.blocked_ips:
            # Log blocked attempt
            audit_logger.log_suspicious_activity(
                user_id=None,
                ip_address=client_ip,
                reason="IP blocked",
                metadata={"path": request.url.path}
            )
            
            return Response(
                content="Access denied",
                status_code=403
            )
        
        return await call_next(request)

class CSRFProtectionMiddleware(BaseHTTPMiddleware):
    """CSRF protection for state-changing requests"""
    
    async def dispatch(self, request: Request, call_next):
        # Only check CSRF for state-changing methods
        if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
            # Skip CSRF check for API endpoints with bearer token auth
            auth_header = request.headers.get("authorization", "")
            if auth_header.startswith("Bearer "):
                # Bearer token authentication - skip CSRF
                return await call_next(request)
            
            # For cookie-based auth, verify CSRF token
            csrf_token = request.headers.get("X-CSRF-Token")
            csrf_cookie = request.cookies.get("csrf_token")
            
            if not csrf_token or csrf_token != csrf_cookie:
                return Response(
                    content="CSRF token missing or invalid",
                    status_code=403
                )
        
        return await call_next(request)
