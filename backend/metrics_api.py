"""Metrics Tracking API for DowUrk AI

This module provides APIs to track key business metrics toward $1B valuation:
- Revenue metrics (ARR, MRR, growth rates)
- Customer metrics (total, churn, retention)
- Unit economics (CAC, LTV, ratios)
- SaaS metrics (Magic Number, Rule of 40, NDR)
"""
from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel, Field
from typing import List, Optional
from datetime import datetime, timezone
import uuid

router = APIRouter(prefix="/api/metrics", tags=["metrics"])

# ========================================
# MODELS
# ========================================

class MetricSnapshot(BaseModel):
    """Single point-in-time metric snapshot"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    date: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))
    
    # Revenue Metrics
    mrr: float = Field(default=0, description="Monthly Recurring Revenue")
    arr: float = Field(default=0, description="Annual Recurring Revenue")
    new_revenue: float = Field(default=0, description="New revenue this period")
    expansion_revenue: float = Field(default=0, description="Revenue from upgrades")
    churned_revenue: float = Field(default=0, description="Revenue lost to churn")
    
    # Customer Metrics
    total_customers: int = Field(default=0)
    new_customers: int = Field(default=0)
    churned_customers: int = Field(default=0)
    active_customers: int = Field(default=0)
    
    # Customer Breakdown by Tier
    free_tier: int = Field(default=0)
    professional_tier: int = Field(default=0)
    business_tier: int = Field(default=0)
    enterprise_tier: int = Field(default=0)
    
    # Unit Economics
    cac: float = Field(default=0, description="Customer Acquisition Cost")
    ltv: float = Field(default=0, description="Customer Lifetime Value")
    arpu: float = Field(default=0, description="Average Revenue Per User")
    
    # Marketing & Sales
    marketing_spend: float = Field(default=0)
    sales_spend: float = Field(default=0)
    total_sales_marketing: float = Field(default=0)
    
    # Calculated Metrics (computed from above)
    mom_growth_rate: Optional[float] = Field(default=None, description="Month-over-month growth %")
    yoy_growth_rate: Optional[float] = Field(default=None, description="Year-over-year growth %")
    ltv_cac_ratio: Optional[float] = Field(default=None)
    gross_margin: Optional[float] = Field(default=0.80, description="Gross margin %")
    net_dollar_retention: Optional[float] = Field(default=None, description="NDR %")
    magic_number: Optional[float] = Field(default=None)
    rule_of_40: Optional[float] = Field(default=None)
    
    # Valuation Tracking
    estimated_valuation: Optional[float] = Field(default=None)
    valuation_multiple: float = Field(default=10.0, description="ARR multiple for valuation")
    progress_to_billion: Optional[float] = Field(default=None, description="% progress to $1B")

class MetricsSummary(BaseModel):
    """Summary of current metrics and trends"""
    current: MetricSnapshot
    previous_month: Optional[MetricSnapshot] = None
    previous_year: Optional[MetricSnapshot] = None
    
    # Trends
    mrr_trend: str = Field(default="flat", description="up, down, or flat")
    customer_trend: str = Field(default="flat")
    
    # Goals
    goal_arr_year_1: float = 420000  # $420K
    goal_arr_year_5: float = 90000000  # $90M
    goal_customers_year_1: int = 500
    goal_customers_year_5: int = 90000
    
    # Progress
    years_to_billion: Optional[float] = None
    monthly_growth_needed: Optional[float] = None

class MetricsGoal(BaseModel):
    """Set goals for specific time periods"""
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    year: int
    quarter: Optional[int] = None
    target_arr: float
    target_customers: int
    target_ltv_cac: float = 5.0
    target_churn_rate: float = 5.0
    created_at: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

# ========================================
# ENDPOINTS
# ========================================

@router.post("/snapshots", response_model=MetricSnapshot)
async def create_metric_snapshot(snapshot: MetricSnapshot):
    """Record a new metric snapshot
    
    This endpoint allows you to record current business metrics.
    Calculated fields will be computed automatically.
    """
    # Calculate derived metrics
    snapshot = calculate_derived_metrics(snapshot)
    
    # In production, save to database
    # await db.metrics.insert_one(snapshot.model_dump())
    
    return snapshot

@router.get("/snapshots/latest", response_model=MetricSnapshot)
async def get_latest_snapshot():
    """Get the most recent metric snapshot"""
    # In production, fetch from database
    # snapshot = await db.metrics.find_one(sort=[("date", -1)])
    
    # For now, return sample data
    return get_sample_snapshot()

@router.get("/snapshots", response_model=List[MetricSnapshot])
async def get_metric_snapshots(limit: int = 12):
    """Get historical metric snapshots
    
    Args:
        limit: Number of snapshots to return (default: 12 for last 12 months)
    """
    # In production, fetch from database
    # snapshots = await db.metrics.find().sort("date", -1).limit(limit).to_list(limit)
    
    # For now, return sample data
    return [get_sample_snapshot() for _ in range(min(limit, 3))]

@router.get("/summary", response_model=MetricsSummary)
async def get_metrics_summary():
    """Get comprehensive metrics summary with trends and goals"""
    current = get_sample_snapshot()
    
    summary = MetricsSummary(
        current=current,
        previous_month=None,
        previous_year=None,
        mrr_trend="up",
        customer_trend="up"
    )
    
    # Calculate progress and projections
    summary.years_to_billion = calculate_years_to_billion(current.arr, current.mom_growth_rate or 15)
    summary.monthly_growth_needed = calculate_growth_needed(current.arr, 100000000, 60)  # $100M in 60 months
    
    return summary

@router.post("/goals", response_model=MetricsGoal)
async def create_goal(goal: MetricsGoal):
    """Set a new metrics goal"""
    # In production, save to database
    # await db.goals.insert_one(goal.model_dump())
    
    return goal

@router.get("/goals", response_model=List[MetricsGoal])
async def get_goals():
    """Get all metrics goals"""
    # In production, fetch from database
    # goals = await db.goals.find().sort("year", 1).to_list(100)
    
    # Return predefined goals from fundraising strategy
    return [
        MetricsGoal(year=2025, target_arr=420000, target_customers=500),
        MetricsGoal(year=2026, target_arr=2940000, target_customers=3500),
        MetricsGoal(year=2027, target_arr=12600000, target_customers=15000),
        MetricsGoal(year=2028, target_arr=38400000, target_customers=40000),
        MetricsGoal(year=2029, target_arr=90000000, target_customers=90000),
    ]

@router.get("/valuation")
async def get_valuation_projection():
    """Get current valuation and projection to $1B"""
    current = get_sample_snapshot()
    
    # Calculate valuation if not set
    current_valuation = current.estimated_valuation or (current.arr * current.valuation_multiple)
    progress_pct = (current_valuation / 1000000000) * 100 if current_valuation else 0
    
    return {
        "current_arr": current.arr,
        "current_valuation": current_valuation,
        "target_valuation": 1000000000,
        "progress_percentage": progress_pct,
        "arr_needed_for_billion": 100000000,  # At 10x multiple
        "arr_gap": 100000000 - current.arr,
        "months_at_current_growth": calculate_months_to_target(current.arr, 100000000, current.mom_growth_rate or 15),
        "projection": {
            "year_1": {"arr": 420000, "valuation": 4200000},
            "year_2": {"arr": 2940000, "valuation": 29400000},
            "year_3": {"arr": 12600000, "valuation": 126000000},
            "year_4": {"arr": 38400000, "valuation": 384000000},
            "year_5": {"arr": 90000000, "valuation": 900000000},
            "year_6": {"arr": 120000000, "valuation": 1200000000}
        }
    }

@router.get("/health")
async def metrics_health_check():
    """Check health of key metrics"""
    current = get_sample_snapshot()
    
    health_checks = {
        "ltv_cac_ratio": {
            "value": current.ltv_cac_ratio or 0,
            "target": 3.0,
            "status": "healthy" if (current.ltv_cac_ratio or 0) >= 3.0 else "needs_improvement"
        },
        "gross_margin": {
            "value": current.gross_margin or 0,
            "target": 0.70,
            "status": "healthy" if (current.gross_margin or 0) >= 0.70 else "needs_improvement"
        },
        "growth_rate": {
            "value": current.mom_growth_rate or 0,
            "target": 15.0,
            "status": "healthy" if (current.mom_growth_rate or 0) >= 15.0 else "needs_improvement"
        },
        "net_dollar_retention": {
            "value": current.net_dollar_retention or 0,
            "target": 100.0,
            "status": "healthy" if (current.net_dollar_retention or 0) >= 100.0 else "needs_improvement"
        }
    }
    
    overall_health = "healthy" if all(c["status"] == "healthy" for c in health_checks.values()) else "needs_attention"
    
    return {
        "overall_health": overall_health,
        "checks": health_checks,
        "recommendations": generate_recommendations(health_checks)
    }

# ========================================
# HELPER FUNCTIONS
# ========================================

def calculate_derived_metrics(snapshot: MetricSnapshot) -> MetricSnapshot:
    """Calculate derived metrics from base metrics"""
    # ARR from MRR
    if snapshot.arr == 0 and snapshot.mrr > 0:
        snapshot.arr = snapshot.mrr * 12
    
    # LTV/CAC ratio
    if snapshot.ltv > 0 and snapshot.cac > 0:
        snapshot.ltv_cac_ratio = snapshot.ltv / snapshot.cac
    
    # Net Dollar Retention
    if snapshot.new_revenue > 0 or snapshot.expansion_revenue > 0 or snapshot.churned_revenue > 0:
        starting_revenue = snapshot.mrr - snapshot.new_revenue
        if starting_revenue > 0:
            snapshot.net_dollar_retention = (
                (starting_revenue - snapshot.churned_revenue + snapshot.expansion_revenue) / starting_revenue
            ) * 100
    
    # Magic Number (requires previous quarter data, placeholder for now)
    # magic_number = (net_new_arr_this_quarter) / (sales_marketing_spend_last_quarter)
    
    # Rule of 40
    if snapshot.yoy_growth_rate is not None:
        # Rule of 40 = Growth Rate + Profit Margin
        # For early stage, assume negative margin, so just growth rate
        snapshot.rule_of_40 = snapshot.yoy_growth_rate
    
    # Valuation
    snapshot.estimated_valuation = snapshot.arr * snapshot.valuation_multiple
    
    # Progress to $1B
    if snapshot.estimated_valuation:
        snapshot.progress_to_billion = (snapshot.estimated_valuation / 1000000000) * 100
    
    return snapshot

def calculate_years_to_billion(current_arr: float, monthly_growth_rate: float) -> float:
    """Calculate years to reach $100M ARR (for $1B valuation at 10x)"""
    if current_arr <= 0 or monthly_growth_rate <= 0:
        return 999  # Invalid
    
    target_arr = 100000000  # $100M
    months = 0
    arr = current_arr
    
    while arr < target_arr and months < 120:  # Max 10 years
        arr = arr * (1 + monthly_growth_rate / 100)
        months += 1
    
    return months / 12

def calculate_growth_needed(current_arr: float, target_arr: float, months: int) -> float:
    """Calculate monthly growth rate needed to reach target"""
    if current_arr <= 0 or months <= 0:
        return 0
    
    # Formula: target = current * (1 + r)^months
    # Solving for r: r = (target/current)^(1/months) - 1
    ratio = target_arr / current_arr
    growth_rate = (ratio ** (1/months) - 1) * 100
    
    return growth_rate

def calculate_months_to_target(current: float, target: float, monthly_growth: float) -> int:
    """Calculate months needed to reach target at current growth rate"""
    if current <= 0 or monthly_growth <= 0:
        return 999
    
    months = 0
    value = current
    
    while value < target and months < 120:
        value = value * (1 + monthly_growth / 100)
        months += 1
    
    return months

def generate_recommendations(health_checks: dict) -> List[str]:
    """Generate recommendations based on health checks"""
    recommendations = []
    
    if health_checks["ltv_cac_ratio"]["status"] != "healthy":
        recommendations.append("Improve unit economics: Focus on reducing CAC or increasing LTV")
    
    if health_checks["gross_margin"]["status"] != "healthy":
        recommendations.append("Increase gross margin: Reduce COGS or increase pricing")
    
    if health_checks["growth_rate"]["status"] != "healthy":
        recommendations.append("Accelerate growth: Increase marketing spend or improve conversion rates")
    
    if health_checks["net_dollar_retention"]["status"] != "healthy":
        recommendations.append("Reduce churn: Improve product stickiness and customer success")
    
    if not recommendations:
        recommendations.append("All metrics are healthy! Keep up the great work.")
    
    return recommendations

def get_sample_snapshot() -> MetricSnapshot:
    """Get sample metric snapshot for development"""
    return MetricSnapshot(
        date=datetime.now(timezone.utc),
        mrr=35000,
        arr=420000,
        new_revenue=5000,
        expansion_revenue=2000,
        churned_revenue=1000,
        total_customers=500,
        new_customers=50,
        churned_customers=10,
        active_customers=490,
        free_tier=200,
        professional_tier=250,
        business_tier=40,
        enterprise_tier=10,
        cac=250,
        ltv=1800,
        arpu=70,
        marketing_spend=10000,
        sales_spend=5000,
        total_sales_marketing=15000,
        mom_growth_rate=15.0,
        yoy_growth_rate=600.0,
        gross_margin=0.80,
        net_dollar_retention=105.0,
        valuation_multiple=10.0
    )
