"""
Test script for Louisiana SOS Commercial API integration
"""

import asyncio
import json
from la_sos_service import (
    search_businesses,
    lookup_business,
    validate_certificate,
    check_name_availability,
    verify_business_for_grant,
    LA_SOS_TOKEN,
    LA_SOS_EMAIL
)


async def test_api():
    print("=" * 60)
    print("Louisiana SOS Commercial API Test")
    print("=" * 60)
    print(f"Token: {LA_SOS_TOKEN[:10]}...{LA_SOS_TOKEN[-5:]}")
    print(f"Email: {LA_SOS_EMAIL}")
    print()
    
    # Test 1: Search for businesses
    print("Test 1: Search for businesses named 'DOWURK'")
    print("-" * 40)
    result = await search_businesses(entity_name="DOWURK", use_test_token=True)
    print(json.dumps(result, indent=2, default=str))
    print()
    
    # Test 2: Search for a common Louisiana business
    print("Test 2: Search for 'LOUISIANA'")
    print("-" * 40)
    result = await search_businesses(entity_name="LOUISIANA", use_test_token=True)
    print(f"Result count: {result.get('result_count', 0)}")
    if result.get('results'):
        print(f"First 3 results:")
        for r in result['results'][:3]:
            print(f"  - {r['name']} ({r['entity_type']}) - {r['status']}")
    print()
    
    # Test 3: Check name availability
    print("Test 3: Check name availability for 'DOWURK AI SOLUTIONS'")
    print("-" * 40)
    result = await check_name_availability(business_name="DOWURK AI SOLUTIONS", use_test_token=True)
    print(json.dumps(result, indent=2, default=str))
    print()
    
    # Test 4: Search by officer name
    print("Test 4: Search by officer name 'Smith'")
    print("-" * 40)
    result = await search_businesses(last_name="Smith", use_test_token=True)
    print(f"Result count: {result.get('result_count', 0)}")
    if result.get('results'):
        print(f"First 3 results:")
        for r in result['results'][:3]:
            print(f"  - {r['name']} ({r['entity_type']})")
    print()
    
    print("=" * 60)
    print("API Tests Complete!")
    print("=" * 60)


if __name__ == "__main__":
    asyncio.run(test_api())
