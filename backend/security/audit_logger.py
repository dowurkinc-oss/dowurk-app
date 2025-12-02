"""Audit Logging System"""
import json
import logging
from datetime import datetime, timezone
from typing import Optional, Any
from enum import Enum

class AuditEventType(str, Enum):
    """Types of audit events"""
    # Authentication
    LOGIN_SUCCESS = "authentication.login.success"
    LOGIN_FAILURE = "authentication.login.failure"
    LOGOUT = "authentication.logout"
    PASSWORD_CHANGE = "authentication.password.change"
    PASSWORD_RESET = "authentication.password.reset"
    MFA_ENABLED = "authentication.mfa.enabled"
    MFA_DISABLED = "authentication.mfa.disabled"
    
    # Authorization
    ACCESS_DENIED = "authorization.access.denied"
    PERMISSION_GRANTED = "authorization.permission.granted"
    PERMISSION_REVOKED = "authorization.permission.revoked"
    
    # Data Access
    DATA_READ = "data.read"
    DATA_CREATE = "data.create"
    DATA_UPDATE = "data.update"
    DATA_DELETE = "data.delete"
    DATA_EXPORT = "data.export"
    PII_ACCESS = "data.pii.access"
    
    # Admin Actions
    USER_CREATED = "admin.user.created"
    USER_DELETED = "admin.user.deleted"
    USER_SUSPENDED = "admin.user.suspended"
    ROLE_CHANGED = "admin.role.changed"
    CONFIG_CHANGED = "admin.config.changed"
    
    # API
    API_KEY_CREATED = "api.key.created"
    API_KEY_REVOKED = "api.key.revoked"
    API_RATE_LIMIT_EXCEEDED = "api.rate_limit.exceeded"
    
    # Payment
    PAYMENT_SUCCESS = "payment.success"
    PAYMENT_FAILURE = "payment.failure"
    SUBSCRIPTION_CHANGED = "payment.subscription.changed"
    
    # Security
    SECURITY_BREACH_DETECTED = "security.breach.detected"
    SUSPICIOUS_ACTIVITY = "security.suspicious.activity"
    ACCOUNT_LOCKED = "security.account.locked"

class AuditLogger:
    """Centralized audit logging"""
    
    def __init__(self):
        self.logger = logging.getLogger("audit")
        self.logger.setLevel(logging.INFO)
        
        # Configure handler (in production, send to centralized logging)
        handler = logging.StreamHandler()
        formatter = logging.Formatter('%(message)s')
        handler.setFormatter(formatter)
        self.logger.addHandler(handler)
    
    def log_event(
        self,
        event_type: AuditEventType,
        user_id: Optional[str] = None,
        user_email: Optional[str] = None,
        ip_address: Optional[str] = None,
        user_agent: Optional[str] = None,
        resource_type: Optional[str] = None,
        resource_id: Optional[str] = None,
        action: Optional[str] = None,
        status: str = "success",
        metadata: Optional[dict] = None
    ):
        """Log an audit event
        
        Args:
            event_type: Type of event (from AuditEventType enum)
            user_id: User ID performing the action
            user_email: User email
            ip_address: IP address of the request
            user_agent: User agent string
            resource_type: Type of resource accessed (user, project, etc.)
            resource_id: ID of the resource
            action: Action performed (create, read, update, delete)
            status: Status of the action (success, failure)
            metadata: Additional context
        """
        log_entry = {
            "timestamp": datetime.now(timezone.utc).isoformat(),
            "event_type": event_type.value,
            "user_id": user_id,
            "user_email": user_email,
            "ip_address": ip_address,
            "user_agent": user_agent,
            "resource_type": resource_type,
            "resource_id": resource_id,
            "action": action,
            "status": status,
            "metadata": metadata or {}
        }
        
        # Log as JSON for easy parsing
        self.logger.info(json.dumps(log_entry))
        
        # In production, also send to:
        # - CloudWatch Logs
        # - Datadog
        # - Splunk
        # - Database for querying
    
    def log_authentication(self, event_type: AuditEventType, user_email: str, ip_address: str, success: bool, metadata: dict = None):
        """Log authentication events"""
        self.log_event(
            event_type=event_type,
            user_email=user_email,
            ip_address=ip_address,
            status="success" if success else "failure",
            metadata=metadata
        )
    
    def log_data_access(self, user_id: str, resource_type: str, resource_id: str, action: str, ip_address: str):
        """Log data access events"""
        self.log_event(
            event_type=AuditEventType.DATA_READ if action == "read" else AuditEventType.DATA_UPDATE,
            user_id=user_id,
            resource_type=resource_type,
            resource_id=resource_id,
            action=action,
            ip_address=ip_address
        )
    
    def log_pii_access(self, user_id: str, pii_type: str, pii_owner_id: str, ip_address: str):
        """Log PII access (special handling for sensitive data)"""
        self.log_event(
            event_type=AuditEventType.PII_ACCESS,
            user_id=user_id,
            ip_address=ip_address,
            metadata={
                "pii_type": pii_type,
                "pii_owner_id": pii_owner_id,
                "requires_review": True
            }
        )
    
    def log_admin_action(self, admin_id: str, action: str, target_user_id: str, ip_address: str, metadata: dict = None):
        """Log administrative actions"""
        self.log_event(
            event_type=AuditEventType.USER_CREATED,  # Or other admin event type
            user_id=admin_id,
            resource_type="user",
            resource_id=target_user_id,
            action=action,
            ip_address=ip_address,
            metadata=metadata
        )
    
    def log_suspicious_activity(self, user_id: Optional[str], ip_address: str, reason: str, metadata: dict = None):
        """Log suspicious activity for security monitoring"""
        self.log_event(
            event_type=AuditEventType.SUSPICIOUS_ACTIVITY,
            user_id=user_id,
            ip_address=ip_address,
            status="alert",
            metadata={
                "reason": reason,
                **(metadata or {})
            }
        )

# Global audit logger instance
audit_logger = AuditLogger()
