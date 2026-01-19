"""
Louisiana Secretary of State API Routes for DowUrk AI Hub
Business verification, search, and compliance checking endpoints
"""

from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel, Field
from typing import Optional, List
import os

from la_sos_service import (
    search_businesses,
    lookup_business,
    validate_certificate,
    check_name_availability,
    verify_business_for_grant,
    demo_search_businesses,
    demo_lookup_business,
    ENTITY_TYPES
)

# Create router
la_sos_router = APIRouter(prefix="/api/la-sos", tags=["Louisiana SOS"])

# We have a test token from Louisiana SOS - use it for real API calls
# Test token expires 1/19/2027
USE_DEMO_MODE = False  # Set to True to use demo data instead of real API


# ==================== REQUEST MODELS ====================

class BusinessSearchRequest(BaseModel):
    entity_name: Optional[str] = Field(None, description="Business name to search")
    first_name: Optional[str] = Field(None, description="Agent/officer first name")
    last_name: Optional[str] = Field(None, description="Agent/officer last name")


class BusinessLookupRequest(BaseModel):
    entity_number: str = Field(..., description="Entity number to look up")
    entity_type_id: int = Field(1, description="1=Charter, 8=Name Reservation, 16=Trade Service")


class CertificateValidationRequest(BaseModel):
    certificate_id: str = Field(..., description="Certificate ID to validate")


class NameAvailabilityRequest(BaseModel):
    business_name: str = Field(..., description="Proposed business name")


class GrantVerificationRequest(BaseModel):
    entity_number: str = Field(..., description="Entity number to verify")
    entity_type_id: int = Field(1, description="Entity type ID")


# ==================== ENDPOINTS ====================

@la_sos_router.get("/status")
async def get_api_status():
    """Check Louisiana SOS API integration status"""
    return {
        "service": "Louisiana Secretary of State Commercial API",
        "mode": "demo" if USE_DEMO_MODE else "live",
        "api_base": "https://commercialapi.sos.la.gov",
        "subscription_url": "https://subscriptions.sos.la.gov",
        "subscription_cost": "$500/year",
        "rate_limit": "18 calls/minute",
        "features": [
            "Business Search",
            "Business Lookup",
            "Certificate Validation",
            "Name Availability Check",
            "Grant Eligibility Verification"
        ],
        "entity_types": ENTITY_TYPES,
        "note": "Demo mode uses sample data. Subscribe to LA SOS API for real business data." if USE_DEMO_MODE else "Live mode - using real Louisiana business data."
    }


@la_sos_router.post("/search")
async def search_louisiana_businesses(request: BusinessSearchRequest):
    """
    Search for businesses registered in Louisiana.
    
    Search by business name or by agent/officer name.
    Returns up to 1000 matching records.
    """
    if not request.entity_name and not (request.first_name or request.last_name):
        raise HTTPException(
            status_code=400, 
            detail="Must provide entity_name or first_name/last_name"
        )
    
    if USE_DEMO_MODE and request.entity_name:
        result = await demo_search_businesses(request.entity_name)
    else:
        result = await search_businesses(
            entity_name=request.entity_name,
            first_name=request.first_name,
            last_name=request.last_name,
            use_test_token=USE_DEMO_MODE
        )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result


@la_sos_router.post("/lookup")
async def lookup_louisiana_business(request: BusinessLookupRequest):
    """
    Get detailed information about a specific Louisiana business.
    
    Returns comprehensive details including:
    - Business status and registration info
    - Registered agents and officers
    - Business addresses
    - Annual report status
    - Previous names and amendments
    """
    if USE_DEMO_MODE:
        result = await demo_lookup_business(request.entity_number)
    else:
        result = await lookup_business(
            entity_number=request.entity_number,
            entity_type_id=request.entity_type_id,
            use_test_token=USE_DEMO_MODE
        )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result


@la_sos_router.post("/validate-certificate")
async def validate_business_certificate(request: CertificateValidationRequest):
    """
    Validate the authenticity of a Louisiana business certificate.
    
    Returns whether the certificate is valid and associated entity information.
    """
    if USE_DEMO_MODE:
        return {
            "success": True,
            "is_valid": True,
            "certificate_id": request.certificate_id,
            "certificate_date": "2024-01-15",
            "entity_name": "SAMPLE BUSINESS LLC",
            "entity_number": "42345678A",
            "validation_message": "Certificate validated successfully (Demo Mode)",
            "note": "This is demo data. Subscribe to LA SOS API for real certificate validation."
        }
    
    result = await validate_certificate(
        certificate_id=request.certificate_id,
        use_test_token=False
    )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result


@la_sos_router.post("/check-name")
async def check_business_name_availability(request: NameAvailabilityRequest):
    """
    Check if a business name is available for registration in Louisiana.
    
    Returns availability status and list of similar existing names.
    """
    if USE_DEMO_MODE:
        # Demo mode - simulate name check
        sample_similar = [
            {"name": f"{request.business_name} LLC", "entity_number": "DEMO001", "status": "Active"},
            {"name": f"{request.business_name} INC", "entity_number": "DEMO002", "status": "Active"},
        ]
        
        return {
            "success": True,
            "business_name": request.business_name,
            "is_available": True,
            "exact_match": None,
            "similar_names": sample_similar,
            "recommendation": f"The name '{request.business_name}' appears to be available for registration.",
            "disclaimer": "This is a preliminary check using demo data. Subscribe to LA SOS API for accurate results.",
            "next_steps": [
                "Reserve the name with Louisiana Secretary of State",
                "File Articles of Incorporation/Organization",
                "Obtain necessary business licenses"
            ]
        }
    
    result = await check_name_availability(
        business_name=request.business_name,
        use_test_token=False
    )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result


@la_sos_router.post("/verify-for-grant")
async def verify_business_grant_eligibility(request: GrantVerificationRequest):
    """
    Verify a business meets common grant eligibility requirements.
    
    Checks:
    - Business is registered
    - Business is active
    - Business is in good standing
    - Has registered agent
    - Is Louisiana-based
    
    Returns eligibility score and recommendations.
    """
    if USE_DEMO_MODE:
        return {
            "success": True,
            "business_name": "SAMPLE LOUISIANA BUSINESS LLC",
            "entity_number": request.entity_number,
            "verification_date": "2026-01-19T12:00:00",
            "eligibility_criteria": {
                "is_registered": True,
                "is_active": True,
                "is_good_standing": True,
                "has_registered_agent": True,
                "is_louisiana_based": True
            },
            "eligibility_score": 100.0,
            "is_grant_eligible": True,
            "recommendations": [],
            "business_details": {
                "status": "Active",
                "registration_date": "2020-06-15",
                "business_type": "Limited Liability Company",
                "annual_report_status": "Good Standing"
            },
            "note": "This is demo data. Subscribe to LA SOS API for real verification."
        }
    
    result = await verify_business_for_grant(
        entity_number=request.entity_number,
        entity_type_id=request.entity_type_id,
        use_test_token=False
    )
    
    if "error" in result:
        raise HTTPException(status_code=500, detail=result["error"])
    
    return result


@la_sos_router.get("/entity-types")
async def get_entity_types():
    """Get available entity types for Louisiana business searches"""
    return {
        "entity_types": [
            {"id": 1, "name": "Charter", "description": "Corporations, LLCs, and other chartered entities"},
            {"id": 8, "name": "Name Reservation", "description": "Reserved business names"},
            {"id": 16, "name": "Trade Service", "description": "Trade names and service marks"}
        ]
    }


@la_sos_router.get("/formation-guide")
async def get_business_formation_guide():
    """Get Louisiana business formation guidance"""
    return {
        "title": "Louisiana Business Formation Guide",
        "steps": [
            {
                "step": 1,
                "title": "Choose Your Business Structure",
                "description": "Decide between LLC, Corporation, Sole Proprietorship, or Partnership",
                "considerations": [
                    "Liability protection needs",
                    "Tax implications",
                    "Management structure",
                    "Future growth plans"
                ]
            },
            {
                "step": 2,
                "title": "Check Name Availability",
                "description": "Use our name checker to verify your business name is available",
                "api_endpoint": "/api/la-sos/check-name"
            },
            {
                "step": 3,
                "title": "Reserve Your Business Name (Optional)",
                "description": "Reserve your name for 60 days while preparing documents",
                "cost": "$25",
                "url": "https://www.sos.la.gov"
            },
            {
                "step": 4,
                "title": "File Formation Documents",
                "description": "Submit Articles of Incorporation or Organization",
                "costs": {
                    "LLC": "$100",
                    "Corporation": "$75",
                    "Non-Profit": "$35"
                },
                "url": "https://www.sos.la.gov/BusinessServices"
            },
            {
                "step": 5,
                "title": "Obtain EIN",
                "description": "Get your Employer Identification Number from the IRS",
                "cost": "Free",
                "url": "https://www.irs.gov/businesses/small-businesses-self-employed/apply-for-an-employer-identification-number-ein-online"
            },
            {
                "step": 6,
                "title": "Register for State Taxes",
                "description": "Register with Louisiana Department of Revenue",
                "url": "https://revenue.louisiana.gov"
            },
            {
                "step": 7,
                "title": "Obtain Business Licenses",
                "description": "Check parish and city requirements for local licenses",
                "tip": "Requirements vary by location and business type"
            }
        ],
        "resources": [
            {
                "name": "Louisiana Secretary of State",
                "url": "https://www.sos.la.gov",
                "description": "Official business registration"
            },
            {
                "name": "Louisiana Small Business Development Center",
                "url": "https://www.lsbdc.org",
                "description": "Free business consulting"
            },
            {
                "name": "Louisiana Economic Development",
                "url": "https://www.opportunitylouisiana.gov",
                "description": "Business incentives and programs"
            }
        ],
        "ai_assistance": "Use our AI Business Coach for personalized guidance through each step!"
    }
