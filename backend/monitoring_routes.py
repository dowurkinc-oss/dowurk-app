"""
Monitoring & Health Check Routes for DowUrk AI
Provides system health, metrics, and performance monitoring
"""
from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Dict, List, Optional
from datetime import datetime, timezone
import os
import psutil
import logging

logger = logging.getLogger(__name__)

router = APIRouter(prefix="/api/monitoring", tags=["monitoring"])

# Global database reference
db = None

def set_database(database):
    """Set the database instance for this router"""
    global db
    db = database

# ========================================
# MODELS
# ========================================

class HealthCheckResponse(BaseModel):
    status: str
    timestamp: datetime
    services: Dict[str, str]
    version: str

class SystemMetricsResponse(BaseModel):
    cpu_percent: float
    memory_percent: float
    disk_percent: float
    timestamp: datetime

class UsageStatistics(BaseModel):
    total_users: int
    active_users_today: int
    total_ai_conversations: int
    total_payments: int
    successful_payments: int
    failed_payments: int
    timestamp: datetime

class APIMetricsResponse(BaseModel):
    total_requests: int
    avg_response_time: float
    error_rate: float
    endpoints: Dict[str, int]

# ========================================
# HEALTH CHECK ENDPOINT
# ========================================

@router.get("/health", response_model=HealthCheckResponse)
async def health_check():
    """
    Comprehensive health check for all services
    Returns the status of database, AI service, payment service, etc.
    """
    try:
        services = {}
        
        # Check Database
        try:
            await db.command("ping")
            services["database"] = "healthy"
        except Exception as e:
            services["database"] = f"unhealthy: {str(e)}"
            logger.error(f"Database health check failed: {str(e)}")
        
        # Check AI Service (Emergent LLM Key)
        if os.environ.get('EMERGENT_LLM_KEY'):
            services["ai_service"] = "configured"
        else:
            services["ai_service"] = "not_configured"
        
        # Check Payment Service (Stripe)
        if os.environ.get('STRIPE_API_KEY'):
            services["payment_service"] = "configured"
        else:
            services["payment_service"] = "not_configured"
        
        # Overall status
        overall_status = "healthy" if all(
            status in ["healthy", "configured"] 
            for status in services.values()
        ) else "degraded"
        
        return HealthCheckResponse(
            status=overall_status,
            timestamp=datetime.now(timezone.utc),
            services=services,
            version="1.0.0"
        )
        
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Health check failed: {str(e)}")

# ========================================
# SYSTEM METRICS
# ========================================

@router.get("/system-metrics", response_model=SystemMetricsResponse)
async def get_system_metrics():
    """
    Get system resource usage metrics
    CPU, Memory, Disk usage
    """
    try:
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        return SystemMetricsResponse(
            cpu_percent=cpu_percent,
            memory_percent=memory.percent,
            disk_percent=disk.percent,
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"System metrics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get system metrics: {str(e)}")

# ========================================
# USAGE STATISTICS
# ========================================

@router.get("/usage-stats", response_model=UsageStatistics)
async def get_usage_statistics():
    """
    Get platform usage statistics
    Users, conversations, payments, etc.
    """
    try:
        # Count total users
        total_users = await db.users.count_documents({})
        
        # Count active users today (users who logged in today)
        today_start = datetime.now(timezone.utc).replace(hour=0, minute=0, second=0, microsecond=0)
        active_users_today = await db.users.count_documents({
            "last_login": {"$gte": today_start.isoformat()}
        })
        
        # Count AI conversations
        total_conversations = await db.ai_conversations.count_documents({})
        
        # Count payments
        total_payments = await db.payment_transactions.count_documents({})
        successful_payments = await db.payment_transactions.count_documents({
            "payment_status": "paid"
        })
        failed_payments = await db.payment_transactions.count_documents({
            "payment_status": {"$in": ["failed", "expired"]}
        })
        
        return UsageStatistics(
            total_users=total_users,
            active_users_today=active_users_today,
            total_ai_conversations=total_conversations,
            total_payments=total_payments,
            successful_payments=successful_payments,
            failed_payments=failed_payments,
            timestamp=datetime.now(timezone.utc)
        )
        
    except Exception as e:
        logger.error(f"Usage statistics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get usage statistics: {str(e)}")

# ========================================
# PERFORMANCE METRICS
# ========================================

@router.get("/performance")
async def get_performance_metrics():
    """
    Get API performance metrics
    Response times, error rates, etc.
    """
    try:
        # This is a simple implementation
        # In production, use APM tools like Datadog, New Relic, etc.
        
        return {
            "message": "Performance metrics available via APM tool",
            "recommendation": "Integrate with Datadog, New Relic, or similar APM service",
            "key_metrics_to_track": [
                "API response times (p50, p95, p99)",
                "Error rate (%)",
                "Requests per second",
                "Database query times",
                "AI API response times",
                "Payment success rate"
            ]
        }
        
    except Exception as e:
        logger.error(f"Performance metrics error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to get performance metrics: {str(e)}")

# ========================================
# ALERTS & THRESHOLDS
# ========================================

@router.get("/alerts")
async def check_alerts():
    """
    Check for system alerts based on thresholds
    """
    try:
        alerts = []
        
        # Check system resources
        cpu_percent = psutil.cpu_percent(interval=1)
        memory = psutil.virtual_memory()
        disk = psutil.disk_usage('/')
        
        if cpu_percent > 80:
            alerts.append({
                "severity": "warning",
                "message": f"High CPU usage: {cpu_percent}%",
                "recommendation": "Consider scaling horizontally"
            })
        
        if memory.percent > 85:
            alerts.append({
                "severity": "warning",
                "message": f"High memory usage: {memory.percent}%",
                "recommendation": "Investigate memory leaks or scale up"
            })
        
        if disk.percent > 90:
            alerts.append({
                "severity": "critical",
                "message": f"High disk usage: {disk.percent}%",
                "recommendation": "Clean up logs or increase disk space"
            })
        
        # Check failed payments
        failed_payment_count = await db.payment_transactions.count_documents({
            "payment_status": "failed"
        })
        
        if failed_payment_count > 10:
            alerts.append({
                "severity": "warning",
                "message": f"High number of failed payments: {failed_payment_count}",
                "recommendation": "Investigate payment gateway issues"
            })
        
        return {
            "status": "ok" if len(alerts) == 0 else "alerts_present",
            "alert_count": len(alerts),
            "alerts": alerts,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
    except Exception as e:
        logger.error(f"Alert check error: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Failed to check alerts: {str(e)}")
