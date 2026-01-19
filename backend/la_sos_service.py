"""
Louisiana Secretary of State Commercial API Service
Provides business verification, search, and compliance checking for DowUrk AI Hub
"""

import os
import httpx
from typing import Dict, List, Optional, Any
from datetime import datetime
from pydantic import BaseModel
import asyncio

# API Configuration
LA_SOS_API_BASE = "https://commercialapi.sos.la.gov"
# Test token provided by Louisiana SOS - expires 1/19/2027
LA_SOS_TOKEN = os.getenv("LA_SOS_API_TOKEN", "z5AjcETzZOTrn28GtYUbDQDTLuqlUhsXUlG")
LA_SOS_EMAIL = os.getenv("LA_SOS_API_EMAIL", "info@dowurktoday.org")

# Entity Type IDs
ENTITY_TYPES = {
    1: "Charter",
    8: "Name Reservation", 
    16: "Trade Service"
}


class BusinessSearchResult(BaseModel):
    """Model for business search results"""
    name: str
    entity_number: str
    entity_type: str
    city: Optional[str] = None
    status: Optional[str] = None
    type_name: Optional[str] = None


class BusinessDetails(BaseModel):
    """Model for detailed business information"""
    entity_type: str
    entity_number: str
    name: str
    status: str
    sub_status: Optional[str] = None
    registration_date: Optional[str] = None
    file_date: Optional[str] = None
    city: Optional[str] = None
    category: Optional[str] = None
    business_type: Optional[str] = None
    annual_report_status: Optional[str] = None
    agents: List[Dict] = []
    officers: List[Dict] = []
    addresses: List[Dict] = []
    is_good_standing: bool = False


class CertificateValidation(BaseModel):
    """Model for certificate validation results"""
    is_valid: bool
    certificate_id: str
    certificate_date: Optional[str] = None
    entity_name: Optional[str] = None
    entity_number: Optional[str] = None
    validation_message: str


async def search_businesses(
    entity_name: Optional[str] = None,
    first_name: Optional[str] = None,
    last_name: Optional[str] = None,
    use_test_token: bool = True
) -> Dict[str, Any]:
    """
    Search for businesses by entity name or agent/officer name.
    
    Args:
        entity_name: Business name to search for
        first_name: Agent/officer first name
        last_name: Agent/officer last name
        use_test_token: Use test token (free) vs live token (paid)
    
    Returns:
        Dictionary with search results
    """
    if not entity_name and not (first_name or last_name):
        return {"error": "Must provide entity_name or first_name/last_name"}
    
    # Build request parameters
    params = {
        "Token": LA_SOS_TOKEN if not use_test_token else "TEST",
        "EmailAddress": LA_SOS_EMAIL or "test@dowurktoday.org"
    }
    
    if entity_name:
        params["EntityName"] = entity_name
    if first_name:
        params["FirstName"] = first_name
    if last_name:
        params["LastName"] = last_name
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{LA_SOS_API_BASE}/api/Commercial/Search",
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "error": f"API request failed with status {response.status_code}",
                    "status_code": response.status_code
                }
            
            data = response.json()
            
            # Check for API errors
            if data.get("Status") == "Error":
                return {
                    "error": data.get("Message", "Unknown error"),
                    "response_code": data.get("ResponseCode")
                }
            
            # Parse results
            results = []
            
            # Entity search results
            for entity in data.get("EntitySearchResults", []):
                results.append(BusinessSearchResult(
                    name=entity.get("Name", ""),
                    entity_number=entity.get("EntityNumber", ""),
                    entity_type=ENTITY_TYPES.get(entity.get("EntityTypeId", 0), "Unknown"),
                    city=entity.get("City"),
                    status=entity.get("EntityStatus"),
                    type_name=entity.get("TypeName")
                ))
            
            # Agent/Officer search results
            for agent in data.get("AgentOfficerSearchResults", []):
                results.append(BusinessSearchResult(
                    name=agent.get("AgentOfficerName", ""),
                    entity_number=agent.get("EntityNumber", ""),
                    entity_type=ENTITY_TYPES.get(agent.get("EntityTypeId", 0), "Unknown"),
                    city=agent.get("City"),
                    status=agent.get("EntityStatus"),
                    type_name=f"{agent.get('TypeName', '')} ({agent.get('Affiliation', '')})"
                ))
            
            return {
                "success": True,
                "result_count": data.get("ResultCount", len(results)),
                "results": [r.model_dump() for r in results],
                "token_type": data.get("TokenType", "Test")
            }
            
    except httpx.TimeoutException:
        return {"error": "Request timed out. Please try again."}
    except Exception as e:
        return {"error": f"Search failed: {str(e)}"}


async def lookup_business(
    entity_number: str,
    entity_type_id: int = 1,
    use_test_token: bool = True
) -> Dict[str, Any]:
    """
    Get detailed information about a specific business entity.
    
    Args:
        entity_number: The unique entity identifier
        entity_type_id: 1=Charter, 8=Name Reservation, 16=Trade Service
        use_test_token: Use test token (free) vs live token (paid)
    
    Returns:
        Dictionary with detailed business information
    """
    params = {
        "Token": LA_SOS_TOKEN if not use_test_token else "TEST",
        "EmailAddress": LA_SOS_EMAIL or "test@dowurktoday.org",
        "EntityNumber": entity_number,
        "EntityTypeId": entity_type_id
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{LA_SOS_API_BASE}/api/Commercial/Search",
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "error": f"API request failed with status {response.status_code}",
                    "status_code": response.status_code
                }
            
            data = response.json()
            
            if data.get("Status") == "Error":
                return {
                    "error": data.get("Message", "Unknown error"),
                    "response_code": data.get("ResponseCode")
                }
            
            # Parse based on entity type
            if entity_type_id == 1:  # Charter
                details = data.get("CharterDetails", {})
                return _parse_charter_details(details)
            elif entity_type_id == 8:  # Name Reservation
                details = data.get("NameReservationDetails", {})
                return _parse_name_reservation_details(details)
            elif entity_type_id == 16:  # Trade Service
                details = data.get("TradeServiceDetails", {})
                return _parse_trade_service_details(details)
            else:
                return {"error": f"Unknown entity type: {entity_type_id}"}
                
    except httpx.TimeoutException:
        return {"error": "Request timed out. Please try again."}
    except Exception as e:
        return {"error": f"Lookup failed: {str(e)}"}


def _parse_charter_details(details: Dict) -> Dict[str, Any]:
    """Parse charter details from API response"""
    if not details:
        return {"error": "No charter details found"}
    
    # Determine good standing status
    annual_status = details.get("AnnualReportStatus", "")
    is_good_standing = annual_status.lower() in ["good standing", "current", "active"]
    
    return {
        "success": True,
        "entity_type": "Charter",
        "entity_number": details.get("CharterNumber", ""),
        "name": details.get("CharterName", ""),
        "status": details.get("CharterStatusDescription", ""),
        "sub_status": details.get("CharterSubStatusDescription"),
        "registration_date": details.get("RegistrationDate"),
        "file_date": details.get("FileDate"),
        "city": details.get("City"),
        "category": details.get("CharterCategory"),
        "business_type": details.get("BusinessType"),
        "annual_report_status": annual_status,
        "is_good_standing": is_good_standing,
        "agents": [
            {
                "name": f"{a.get('FirstName', '')} {a.get('LastName', '')}".strip(),
                "address": f"{a.get('Address1', '')} {a.get('Address2', '')}".strip(),
                "city": a.get("City"),
                "state": a.get("State"),
                "zip": a.get("ZipCode"),
                "appointment_date": a.get("AppointmentDate")
            }
            for a in details.get("Agents", [])
        ],
        "officers": [
            {
                "name": f"{o.get('FirstName', '')} {o.get('LastName', '')}".strip(),
                "titles": o.get("Titles", ""),
                "address": f"{o.get('Address1', '')} {o.get('Address2', '')}".strip(),
                "city": o.get("City"),
                "state": o.get("State"),
                "zip": o.get("Zip")
            }
            for o in details.get("Officers", [])
        ],
        "addresses": [
            {
                "type": addr.get("AddressType"),
                "address1": addr.get("Address1"),
                "address2": addr.get("Address2"),
                "city": addr.get("City"),
                "state": addr.get("State"),
                "zip": addr.get("ZipCode")
            }
            for addr in details.get("Addresses", [])
        ],
        "previous_names": [
            {"name": pn.get("Name"), "change_date": pn.get("ChangeDate")}
            for pn in details.get("PreviousNames", [])
        ],
        "amendments": [
            {"description": am.get("Description"), "date_filed": am.get("DateFiled")}
            for am in details.get("Amendments", [])
        ]
    }


def _parse_name_reservation_details(details: Dict) -> Dict[str, Any]:
    """Parse name reservation details from API response"""
    if not details:
        return {"error": "No name reservation details found"}
    
    return {
        "success": True,
        "entity_type": "Name Reservation",
        "reserved_name": details.get("ReservedName", ""),
        "status": details.get("Status", ""),
        "contact_name": details.get("ContactName"),
        "contact_address": details.get("ContactAddress"),
        "file_date": details.get("FileDate"),
        "expiration_date": details.get("ExpirationDate"),
        "reservation_type": details.get("NameReservationType"),
        "on_behalf_of": details.get("OnBehalfOf"),
        "state_of_incorporation": details.get("StateOrCountryOfIncorporation")
    }


def _parse_trade_service_details(details: Dict) -> Dict[str, Any]:
    """Parse trade service details from API response"""
    if not details:
        return {"error": "No trade service details found"}
    
    return {
        "success": True,
        "entity_type": "Trade Service",
        "registered_name": details.get("RegisteredName", ""),
        "applicant_name": details.get("ApplicantName"),
        "applicant_address": details.get("ApplicantAddress"),
        "type_of_business": details.get("TypeOfBusiness"),
        "book_number": details.get("BookNumber"),
        "status": details.get("Status", ""),
        "sub_status": details.get("SubStatus"),
        "registration_date": details.get("RegistrationDate"),
        "expiration_date": details.get("ExpirationDate"),
        "date_first_used": details.get("DateFirstUsed"),
        "date_first_used_in_la": details.get("DateFirstUsedInLA")
    }


async def validate_certificate(
    certificate_id: str,
    use_test_token: bool = True
) -> Dict[str, Any]:
    """
    Validate a Louisiana business certificate.
    
    Args:
        certificate_id: The certificate ID to validate (replace # with _)
        use_test_token: Use test token (free) vs live token (paid)
    
    Returns:
        Dictionary with validation results
    """
    # API requires replacing # with _ in certificate ID
    formatted_cert_id = certificate_id.replace("#", "_")
    
    params = {
        "Token": LA_SOS_TOKEN if not use_test_token else "TEST",
        "EmailAddress": LA_SOS_EMAIL or "test@dowurktoday.org",
        "CertificateId": formatted_cert_id
    }
    
    try:
        async with httpx.AsyncClient(timeout=30.0) as client:
            response = await client.get(
                f"{LA_SOS_API_BASE}/api/Certificate/Validate",
                params=params
            )
            
            if response.status_code != 200:
                return {
                    "error": f"API request failed with status {response.status_code}",
                    "status_code": response.status_code
                }
            
            data = response.json()
            
            if data.get("Status") == "Error":
                return {
                    "error": data.get("Message", "Unknown error"),
                    "response_code": data.get("ResponseCode")
                }
            
            return {
                "success": True,
                "is_valid": data.get("IsValid", False),
                "certificate_id": data.get("CertificateId", certificate_id),
                "certificate_date": data.get("CertificateDate"),
                "entity_name": data.get("EntityName"),
                "entity_number": data.get("EntityNumber"),
                "validation_message": data.get("ValidationMessage", "Certificate validated successfully" if data.get("IsValid") else "Certificate is not valid")
            }
            
    except httpx.TimeoutException:
        return {"error": "Request timed out. Please try again."}
    except Exception as e:
        return {"error": f"Validation failed: {str(e)}"}


async def check_name_availability(
    business_name: str,
    use_test_token: bool = True
) -> Dict[str, Any]:
    """
    Check if a business name is available for registration in Louisiana.
    
    Args:
        business_name: The proposed business name
        use_test_token: Use test token (free) vs live token (paid)
    
    Returns:
        Dictionary with availability status and similar names
    """
    # Search for exact and similar matches
    search_result = await search_businesses(
        entity_name=business_name,
        use_test_token=use_test_token
    )
    
    if "error" in search_result:
        return search_result
    
    results = search_result.get("results", [])
    
    # Check for exact match
    exact_match = None
    similar_names = []
    
    for result in results:
        if result["name"].lower() == business_name.lower():
            exact_match = result
        else:
            similar_names.append(result)
    
    is_available = exact_match is None
    
    return {
        "success": True,
        "business_name": business_name,
        "is_available": is_available,
        "exact_match": exact_match,
        "similar_names": similar_names[:10],  # Limit to 10 similar names
        "recommendation": (
            f"The name '{business_name}' appears to be available for registration."
            if is_available else
            f"The name '{business_name}' is already registered. Consider choosing a different name."
        ),
        "disclaimer": "This is a preliminary check. Final availability is determined by the Louisiana Secretary of State."
    }


async def verify_business_for_grant(
    entity_number: str,
    entity_type_id: int = 1,
    use_test_token: bool = True
) -> Dict[str, Any]:
    """
    Verify a business meets common grant eligibility requirements.
    
    Args:
        entity_number: The business entity number
        entity_type_id: Entity type (1=Charter)
        use_test_token: Use test token
    
    Returns:
        Dictionary with verification results and eligibility assessment
    """
    # Get business details
    details = await lookup_business(
        entity_number=entity_number,
        entity_type_id=entity_type_id,
        use_test_token=use_test_token
    )
    
    if "error" in details:
        return details
    
    # Assess eligibility criteria
    eligibility = {
        "is_registered": True,
        "is_active": details.get("status", "").lower() in ["active", "good standing"],
        "is_good_standing": details.get("is_good_standing", False),
        "has_registered_agent": len(details.get("agents", [])) > 0,
        "is_louisiana_based": any(
            addr.get("state", "").upper() == "LA" 
            for addr in details.get("addresses", [])
        )
    }
    
    # Calculate overall eligibility score
    criteria_met = sum(eligibility.values())
    total_criteria = len(eligibility)
    eligibility_score = (criteria_met / total_criteria) * 100
    
    # Generate recommendations
    recommendations = []
    if not eligibility["is_active"]:
        recommendations.append("Ensure your business status is active with the Secretary of State")
    if not eligibility["is_good_standing"]:
        recommendations.append("File any overdue annual reports to achieve good standing")
    if not eligibility["has_registered_agent"]:
        recommendations.append("Appoint a registered agent for your business")
    if not eligibility["is_louisiana_based"]:
        recommendations.append("Verify your Louisiana business address is on file")
    
    return {
        "success": True,
        "business_name": details.get("name"),
        "entity_number": entity_number,
        "verification_date": datetime.now().isoformat(),
        "eligibility_criteria": eligibility,
        "eligibility_score": eligibility_score,
        "is_grant_eligible": eligibility_score >= 80,
        "recommendations": recommendations,
        "business_details": {
            "status": details.get("status"),
            "registration_date": details.get("registration_date"),
            "business_type": details.get("business_type"),
            "annual_report_status": details.get("annual_report_status")
        }
    }


# Demo function for testing without API subscription
async def demo_search_businesses(entity_name: str) -> Dict[str, Any]:
    """Demo search function with sample data for testing"""
    sample_businesses = [
        {
            "name": "DOWURK INC",
            "entity_number": "42345678A",
            "entity_type": "Charter",
            "city": "Hammond",
            "status": "Active",
            "type_name": "Non-Profit Corporation"
        },
        {
            "name": "LOUISIANA SMALL BUSINESS LLC",
            "entity_number": "42345679B",
            "entity_type": "Charter",
            "city": "Baton Rouge",
            "status": "Active",
            "type_name": "Limited Liability Company"
        },
        {
            "name": "CREOLE CUISINE CATERING",
            "entity_number": "42345680C",
            "entity_type": "Charter",
            "city": "New Orleans",
            "status": "Active",
            "type_name": "Corporation"
        }
    ]
    
    # Filter by name
    results = [
        b for b in sample_businesses 
        if entity_name.lower() in b["name"].lower()
    ]
    
    return {
        "success": True,
        "result_count": len(results),
        "results": results,
        "token_type": "Demo",
        "note": "This is demo data. Subscribe to LA SOS API for real business data."
    }


async def demo_lookup_business(entity_number: str) -> Dict[str, Any]:
    """Demo lookup function with sample data for testing"""
    return {
        "success": True,
        "entity_type": "Charter",
        "entity_number": entity_number,
        "name": "SAMPLE LOUISIANA BUSINESS LLC",
        "status": "Active",
        "sub_status": None,
        "registration_date": "2020-06-15",
        "file_date": "2020-06-15",
        "city": "Baton Rouge",
        "category": "Business",
        "business_type": "Limited Liability Company",
        "annual_report_status": "Good Standing",
        "is_good_standing": True,
        "agents": [
            {
                "name": "John Smith",
                "address": "123 Main Street",
                "city": "Baton Rouge",
                "state": "LA",
                "zip": "70801",
                "appointment_date": "2020-06-15"
            }
        ],
        "officers": [
            {
                "name": "Jane Doe",
                "titles": "President, CEO",
                "address": "123 Main Street",
                "city": "Baton Rouge",
                "state": "LA",
                "zip": "70801"
            }
        ],
        "addresses": [
            {
                "type": "Principal",
                "address1": "123 Main Street",
                "address2": "Suite 100",
                "city": "Baton Rouge",
                "state": "LA",
                "zip": "70801"
            }
        ],
        "previous_names": [],
        "amendments": [],
        "note": "This is demo data. Subscribe to LA SOS API for real business data."
    }
