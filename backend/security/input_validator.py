"""Input Validation and Sanitization"""
import re
import bleach
from typing import Any
from fastapi import HTTPException, status

class InputValidator:
    """Validate and sanitize user inputs"""
    
    @staticmethod
    def sanitize_html(text: str, allowed_tags: list = None) -> str:
        """Sanitize HTML to prevent XSS attacks"""
        if allowed_tags is None:
            # Default: strip all HTML tags
            allowed_tags = []
        
        return bleach.clean(text, tags=allowed_tags, strip=True)
    
    @staticmethod
    def validate_email(email: str) -> bool:
        """Validate email format"""
        pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
        return re.match(pattern, email) is not None
    
    @staticmethod
    def validate_business_name(name: str) -> tuple[bool, str]:
        """Validate business name"""
        if len(name) < 1 or len(name) > 200:
            return False, "Business name must be between 1 and 200 characters"
        
        # Allow letters, numbers, spaces, and common punctuation
        if not re.match(r'^[a-zA-Z0-9\s.,&\'-]+$', name):
            return False, "Business name contains invalid characters"
        
        return True, "Valid"
    
    @staticmethod
    def validate_url(url: str) -> bool:
        """Validate URL format"""
        pattern = r'^https?://[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(/.*)?$'
        return re.match(pattern, url) is not None
    
    @staticmethod
    def validate_phone(phone: str) -> bool:
        """Validate phone number format (US format)"""
        # Remove common formatting characters
        cleaned = re.sub(r'[\s\-\(\)\.]', '', phone)
        # Check if it's 10 or 11 digits (with country code)
        return re.match(r'^\+?1?\d{10}$', cleaned) is not None
    
    @staticmethod
    def sanitize_filename(filename: str) -> str:
        """Sanitize filename to prevent directory traversal"""
        # Remove path separators and hidden file indicators
        filename = filename.replace('/', '').replace('\\', '').replace('..', '')
        # Allow only alphanumeric, dash, underscore, and dot
        filename = re.sub(r'[^a-zA-Z0-9._-]', '', filename)
        return filename
    
    @staticmethod
    def validate_file_extension(filename: str, allowed_extensions: list[str]) -> bool:
        """Validate file extension against whitelist"""
        ext = filename.split('.')[-1].lower() if '.' in filename else ''
        return ext in [e.lower() for e in allowed_extensions]
    
    @staticmethod
    def validate_file_size(size_bytes: int, max_mb: int = 10) -> bool:
        """Validate file size (default max 10MB)"""
        max_bytes = max_mb * 1024 * 1024
        return size_bytes <= max_bytes

class SQLInjectionPrevention:
    """Prevent SQL/NoSQL injection attacks"""
    
    @staticmethod
    def detect_sql_injection(text: str) -> bool:
        """Detect potential SQL injection patterns"""
        # Common SQL injection patterns
        patterns = [
            r'(\bOR\b|\bAND\b)\s+\d+\s*=\s*\d+',  # OR 1=1
            r'[\';\-\-]',  # SQL comment characters
            r'\bUNION\b.*\bSELECT\b',  # UNION SELECT
            r'\bEXEC\b|\bEXECUTE\b',  # EXEC
            r'\bDROP\b.*\bTABLE\b',  # DROP TABLE
            r'\bINSERT\b.*\bINTO\b',  # INSERT INTO
            r'\bDELETE\b.*\bFROM\b',  # DELETE FROM
        ]
        
        text_upper = text.upper()
        return any(re.search(pattern, text_upper, re.IGNORECASE) for pattern in patterns)
    
    @staticmethod
    def validate_input(text: str, field_name: str):
        """Validate input for SQL injection attempts"""
        if SQLInjectionPrevention.detect_sql_injection(text):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Invalid input detected in {field_name}"
            )

class XSSPrevention:
    """Prevent Cross-Site Scripting (XSS) attacks"""
    
    @staticmethod
    def detect_xss(text: str) -> bool:
        """Detect potential XSS patterns"""
        patterns = [
            r'<script[^>]*>.*?</script>',  # Script tags
            r'javascript:',  # JavaScript protocol
            r'on\w+\s*=',  # Event handlers (onclick, onerror, etc.)
            r'<iframe',  # Iframe tags
            r'<embed',  # Embed tags
            r'<object',  # Object tags
        ]
        
        return any(re.search(pattern, text, re.IGNORECASE) for pattern in patterns)
    
    @staticmethod
    def sanitize(text: str) -> str:
        """Sanitize text to prevent XSS"""
        if XSSPrevention.detect_xss(text):
            # Strip all potentially dangerous content
            return bleach.clean(text, tags=[], strip=True)
        return text

class ContentSecurityPolicy:
    """Content Security Policy headers"""
    
    @staticmethod
    def get_csp_header() -> str:
        """Get Content Security Policy header value"""
        return (
            "default-src 'self'; "
            "script-src 'self' 'unsafe-inline' https://cdn.jsdelivr.net; "
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; "
            "font-src 'self' https://fonts.gstatic.com; "
            "img-src 'self' data: https:; "
            "connect-src 'self' https://api.dowurk.ai; "
            "frame-ancestors 'none'; "
            "base-uri 'self'; "
            "form-action 'self';"
        )

class SecurityHeaders:
    """Security headers for all responses"""
    
    @staticmethod
    def get_security_headers() -> dict[str, str]:
        """Get all security headers"""
        return {
            "X-Content-Type-Options": "nosniff",
            "X-Frame-Options": "DENY",
            "X-XSS-Protection": "1; mode=block",
            "Strict-Transport-Security": "max-age=31536000; includeSubDomains",
            "Content-Security-Policy": ContentSecurityPolicy.get_csp_header(),
            "Referrer-Policy": "strict-origin-when-cross-origin",
            "Permissions-Policy": "geolocation=(), microphone=(), camera=()"
        }
