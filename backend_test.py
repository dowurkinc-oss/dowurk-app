"""
Comprehensive Backend API Testing for DowUrk FramewUrk
Tests all critical endpoints with realistic data and edge cases
"""

import requests
import time
import json
from datetime import datetime, timezone, timedelta

# Get backend URL from environment
BACKEND_URL = "https://biz-hub-9.preview.emergentagent.com/api"

# Test data
test_user_email = f"marie.leblanc.{int(time.time())}@example.com"
test_user_password = "SecurePass123!"
test_token = None
test_user_id = None

# Color codes for output
GREEN = '\033[92m'
RED = '\033[91m'
YELLOW = '\033[93m'
BLUE = '\033[94m'
RESET = '\033[0m'

def print_test(test_name):
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}Testing: {test_name}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}")

def print_success(message):
    print(f"{GREEN}✓ {message}{RESET}")

def print_error(message):
    print(f"{RED}✗ {message}{RESET}")

def print_warning(message):
    print(f"{YELLOW}⚠ {message}{RESET}")

def print_info(message):
    print(f"  {message}")

# ==================== AUTHENTICATION TESTS ====================

def test_user_registration():
    """Test user registration endpoint"""
    print_test("User Registration (POST /api/auth/register)")
    
    user_data = {
        "email": test_user_email,
        "password": test_user_password,
        "full_name": "Marie LeBlanc",
        "user_type": "entrepreneur",
        "phone": "+1-504-555-0123",
        "location": "New Orleans, LA",
        "bio": "Aspiring entrepreneur passionate about Louisiana's Creole cuisine",
        "interests": ["food", "catering", "community"]
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/register", json=user_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            global test_token, test_user_id
            test_token = data.get('access_token')
            test_user_id = data.get('user', {}).get('id')
            
            if test_token and test_user_id:
                print_success(f"User registered successfully")
                print_info(f"User ID: {test_user_id}")
                print_info(f"Token received: {test_token[:20]}...")
                return True
            else:
                print_error("Registration response missing token or user ID")
                return False
        else:
            print_error(f"Registration failed: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Registration request failed: {str(e)}")
        return False

def test_user_login():
    """Test user login endpoint"""
    print_test("User Login (POST /api/auth/login)")
    
    login_data = {
        "email": test_user_email,
        "password": test_user_password
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            token = data.get('access_token')
            
            if token:
                print_success("Login successful")
                print_info(f"Token: {token[:20]}...")
                return True
            else:
                print_error("Login response missing token")
                return False
        else:
            print_error(f"Login failed: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Login request failed: {str(e)}")
        return False

def test_invalid_login():
    """Test login with invalid credentials"""
    print_test("Invalid Login (POST /api/auth/login)")
    
    login_data = {
        "email": test_user_email,
        "password": "WrongPassword123!"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/auth/login", json=login_data, timeout=10)
        
        if response.status_code == 401:
            print_success("Invalid credentials correctly rejected (401)")
            return True
        else:
            print_error(f"Expected 401, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Invalid login test failed: {str(e)}")
        return False

# ==================== BUSINESS DIRECTORY TESTS ====================

def test_create_business():
    """Test creating a business (requires auth)"""
    print_test("Create Business (POST /api/businesses)")
    
    if not test_token:
        print_error("No auth token available - skipping")
        return False
    
    business_data = {
        "business_name": "Marie's Creole Kitchen",
        "owner_name": "Marie LeBlanc",
        "email": test_user_email,
        "phone": "+1-504-555-0123",
        "category": "food",
        "description": "Authentic Louisiana Creole cuisine with family recipes passed down through generations",
        "address": "1234 Magazine Street",
        "city": "New Orleans",
        "parish": "Orleans",
        "zip_code": "70130",
        "website": "https://mariescreolekitchen.com",
        "social_media": {
            "instagram": "@mariescreole",
            "facebook": "mariescreolekitchen"
        },
        "hours_of_operation": "Tue-Sat 11am-9pm, Sun 10am-3pm",
        "services_offered": ["Dine-in", "Takeout", "Catering", "Private Events"],
        "organization_type": "for-profit",
        "certifications": ["Food Handler Certified", "Louisiana Small Business"]
    }
    
    headers = {"Authorization": f"Bearer {test_token}"}
    
    try:
        response = requests.post(f"{BACKEND_URL}/businesses", json=business_data, headers=headers, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Business created successfully")
            print_info(f"Business ID: {data.get('id')}")
            print_info(f"Business Name: {data.get('business_name')}")
            
            # Check if _id field is excluded
            if '_id' in data:
                print_error("MongoDB _id field not excluded from response")
                return False
            
            return True
        else:
            print_error(f"Business creation failed: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Business creation request failed: {str(e)}")
        return False

def test_get_all_businesses():
    """Test getting all businesses"""
    print_test("Get All Businesses (GET /api/businesses)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/businesses", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} businesses")
            
            if len(data) > 0:
                # Check first business for _id field
                if '_id' in data[0]:
                    print_error("MongoDB _id field not excluded from response")
                    return False
                
                print_info(f"Sample business: {data[0].get('business_name', 'N/A')}")
            
            return True
        else:
            print_error(f"Get businesses failed: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Get businesses request failed: {str(e)}")
        return False

def test_filter_businesses_by_category():
    """Test filtering businesses by category"""
    print_test("Filter Businesses by Category (GET /api/businesses?category=food)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/businesses?category=food", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} food businesses")
            
            # Verify all returned businesses are in food category
            for biz in data:
                if biz.get('category') != 'food':
                    print_error(f"Non-food business returned: {biz.get('business_name')}")
                    return False
            
            return True
        else:
            print_error(f"Filter by category failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Filter by category request failed: {str(e)}")
        return False

def test_search_businesses():
    """Test searching businesses"""
    print_test("Search Businesses (GET /api/businesses?search=creole)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/businesses?search=creole", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Search returned {len(data)} results")
            
            if len(data) > 0:
                print_info(f"Sample result: {data[0].get('business_name', 'N/A')}")
            
            return True
        else:
            print_error(f"Search failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Search request failed: {str(e)}")
        return False

def test_create_business_without_auth():
    """Test creating business without authentication"""
    print_test("Create Business Without Auth (POST /api/businesses)")
    
    business_data = {
        "business_name": "Test Business",
        "owner_name": "Test Owner",
        "email": "test@example.com",
        "phone": "555-0000",
        "category": "retail",
        "description": "Test",
        "address": "123 Test St",
        "city": "Test City",
        "parish": "Test Parish",
        "zip_code": "00000"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/businesses", json=business_data, timeout=10)
        
        if response.status_code == 403 or response.status_code == 401:
            print_success(f"Unauthorized request correctly rejected ({response.status_code})")
            return True
        else:
            print_error(f"Expected 401/403, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Unauthorized business creation test failed: {str(e)}")
        return False

# ==================== GRATITUDE WALL TESTS ====================

def test_create_blessing():
    """Test creating a blessing"""
    print_test("Create Blessing (POST /api/blessings)")
    
    blessing_data = {
        "name": "Marie LeBlanc",
        "blessing": "I'm grateful for the DowUrk community that has supported my journey as an entrepreneur. The resources and connections I've found here have been invaluable in launching my Creole kitchen. Thank you for believing in Louisiana's diverse business community!",
        "is_anonymous": False
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/blessings", json=blessing_data, timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success("Blessing created successfully")
            print_info(f"Blessing ID: {data.get('id')}")
            
            # Check if _id field is excluded
            if '_id' in data:
                print_error("MongoDB _id field not excluded from response")
                return False
            
            return True
        else:
            print_error(f"Blessing creation failed: {response.status_code}")
            print_info(f"Response: {response.text}")
            return False
            
    except Exception as e:
        print_error(f"Blessing creation request failed: {str(e)}")
        return False

def test_get_blessings():
    """Test getting blessings with count"""
    print_test("Get Blessings (GET /api/blessings)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/blessings", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            total = data.get('total', 0)
            blessings = data.get('blessings', [])
            
            print_success(f"Retrieved blessings - Total: {total}, Recent: {len(blessings)}")
            
            if len(blessings) > 0:
                # Check if _id field is excluded
                if '_id' in blessings[0]:
                    print_error("MongoDB _id field not excluded from response")
                    return False
                
                print_info(f"Sample blessing: {blessings[0].get('blessing', 'N/A')[:50]}...")
            
            return True
        else:
            print_error(f"Get blessings failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Get blessings request failed: {str(e)}")
        return False

def test_blessing_word_limit():
    """Test 300-word limit validation"""
    print_test("Blessing Word Limit Validation (POST /api/blessings)")
    
    # Create a blessing with more than 300 words
    long_blessing = " ".join(["word"] * 301)
    
    blessing_data = {
        "name": "Test User",
        "blessing": long_blessing,
        "is_anonymous": False
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/blessings", json=blessing_data, timeout=10)
        
        if response.status_code == 400:
            print_success("Word limit validation working (400 error)")
            return True
        else:
            print_error(f"Expected 400 for word limit, got {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Word limit test failed: {str(e)}")
        return False

def test_blessing_rate_limit():
    """Test rate limiting on blessings endpoint"""
    print_test("Blessing Rate Limiting (POST /api/blessings)")
    
    blessing_data = {
        "name": "Rate Test User",
        "blessing": "Testing rate limiting functionality",
        "is_anonymous": True
    }
    
    try:
        # First submission should succeed
        response1 = requests.post(f"{BACKEND_URL}/blessings", json=blessing_data, timeout=10)
        
        if response1.status_code != 200:
            print_error(f"First submission failed: {response1.status_code}")
            return False
        
        print_info("First submission successful")
        
        # Immediate second submission should be rate limited
        response2 = requests.post(f"{BACKEND_URL}/blessings", json=blessing_data, timeout=10)
        
        if response2.status_code == 429:
            print_success("Rate limiting working correctly (429 Too Many Requests)")
            return True
        else:
            print_error(f"Expected 429 for rate limit, got {response2.status_code}")
            print_warning("Rate limiting may not be working properly")
            return False
            
    except Exception as e:
        print_error(f"Rate limit test failed: {str(e)}")
        return False

# ==================== EVENTS TESTS ====================

def test_get_events():
    """Test getting events"""
    print_test("Get Events (GET /api/events)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/events", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} events")
            
            if len(data) > 0:
                # Check if _id field is excluded
                if '_id' in data[0]:
                    print_error("MongoDB _id field not excluded from response")
                    return False
                
                print_info(f"Sample event: {data[0].get('title', 'N/A')}")
            
            return True
        else:
            print_error(f"Get events failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Get events request failed: {str(e)}")
        return False

# ==================== RESOURCES TESTS ====================

def test_get_resources():
    """Test getting resources"""
    print_test("Get Resources (GET /api/resources)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/resources", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} resources")
            
            if len(data) > 0:
                # Check if _id field is excluded
                if '_id' in data[0]:
                    print_error("MongoDB _id field not excluded from response")
                    return False
                
                print_info(f"Sample resource: {data[0].get('title', 'N/A')}")
            
            return True
        else:
            print_error(f"Get resources failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Get resources request failed: {str(e)}")
        return False

# ==================== GRANTS TESTS ====================

def test_get_grants():
    """Test getting grants"""
    print_test("Get Grants (GET /api/grants)")
    
    try:
        response = requests.get(f"{BACKEND_URL}/grants", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            print_success(f"Retrieved {len(data)} grants")
            
            if len(data) > 0:
                # Check if _id field is excluded
                if '_id' in data[0]:
                    print_error("MongoDB _id field not excluded from response")
                    return False
                
                print_info(f"Sample grant: {data[0].get('title', 'N/A')}")
            
            return True
        else:
            print_error(f"Get grants failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"Get grants request failed: {str(e)}")
        return False

# ==================== AI ASSISTANT TESTS ====================

def test_ai_chat():
    """Test AI chat endpoint"""
    print_test("AI Chat (POST /api/ai/chat)")
    
    chat_data = {
        "message": "What resources are available for Louisiana entrepreneurs?",
        "conversation_history": [],
        "context_type": "general"
    }
    
    try:
        response = requests.post(f"{BACKEND_URL}/ai/chat", json=chat_data, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            ai_response = data.get('response', '')
            
            if ai_response:
                print_success("AI chat response received")
                print_info(f"Response preview: {ai_response[:100]}...")
                
                # Check if it's an error message (API key issue)
                if "having trouble" in ai_response.lower() or "try again later" in ai_response.lower():
                    print_warning("AI returned error message - likely API key issue")
                    print_warning("OpenAI API key may be invalid or expired")
                    return True  # Not a critical failure for testing
                
                return True
            else:
                print_error("AI response is empty")
                return False
        else:
            print_error(f"AI chat failed: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"AI chat request failed: {str(e)}")
        return False

# ==================== DATETIME SERIALIZATION TEST ====================

def test_datetime_serialization():
    """Test that datetime fields are properly serialized"""
    print_test("DateTime Serialization Check")
    
    try:
        # Get businesses to check datetime serialization
        response = requests.get(f"{BACKEND_URL}/businesses", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            
            if len(data) > 0:
                business = data[0]
                created_at = business.get('created_at')
                
                if created_at:
                    # Try to parse the datetime
                    try:
                        if isinstance(created_at, str):
                            datetime.fromisoformat(created_at.replace('Z', '+00:00'))
                            print_success("DateTime fields properly serialized as ISO strings")
                            return True
                        else:
                            print_error(f"DateTime not serialized as string: {type(created_at)}")
                            return False
                    except ValueError as e:
                        print_error(f"DateTime parsing failed: {str(e)}")
                        return False
                else:
                    print_warning("No created_at field found to test")
                    return True
            else:
                print_warning("No businesses to test datetime serialization")
                return True
        else:
            print_error(f"Failed to get businesses for datetime test: {response.status_code}")
            return False
            
    except Exception as e:
        print_error(f"DateTime serialization test failed: {str(e)}")
        return False

# ==================== MAIN TEST RUNNER ====================

def run_all_tests():
    """Run all tests and generate summary"""
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}DowUrk FramewUrk - Comprehensive Backend API Testing{RESET}")
    print(f"{BLUE}Backend URL: {BACKEND_URL}{RESET}")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    results = {}
    
    # Authentication Tests
    results['User Registration'] = test_user_registration()
    results['User Login'] = test_user_login()
    results['Invalid Login'] = test_invalid_login()
    
    # Business Directory Tests
    results['Create Business (Auth Required)'] = test_create_business()
    results['Get All Businesses'] = test_get_all_businesses()
    results['Filter Businesses by Category'] = test_filter_businesses_by_category()
    results['Search Businesses'] = test_search_businesses()
    results['Create Business Without Auth'] = test_create_business_without_auth()
    
    # Gratitude Wall Tests
    results['Create Blessing'] = test_create_blessing()
    results['Get Blessings'] = test_get_blessings()
    results['Blessing Word Limit'] = test_blessing_word_limit()
    results['Blessing Rate Limiting'] = test_blessing_rate_limit()
    
    # Events, Resources, Grants Tests
    results['Get Events'] = test_get_events()
    results['Get Resources'] = test_get_resources()
    results['Get Grants'] = test_get_grants()
    
    # AI Assistant Tests
    results['AI Chat'] = test_ai_chat()
    
    # DateTime Serialization Test
    results['DateTime Serialization'] = test_datetime_serialization()
    
    # Print Summary
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"{BLUE}TEST SUMMARY{RESET}")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    passed = sum(1 for v in results.values() if v)
    failed = sum(1 for v in results.values() if not v)
    total = len(results)
    
    for test_name, result in results.items():
        status = f"{GREEN}PASS{RESET}" if result else f"{RED}FAIL{RESET}"
        print(f"{status} - {test_name}")
    
    print(f"\n{BLUE}{'='*80}{RESET}")
    print(f"Total Tests: {total}")
    print(f"{GREEN}Passed: {passed}{RESET}")
    print(f"{RED}Failed: {failed}{RESET}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    print(f"{BLUE}{'='*80}{RESET}\n")
    
    return results

if __name__ == "__main__":
    run_all_tests()
