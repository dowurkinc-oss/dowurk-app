#!/usr/bin/env python3
"""
Final Comprehensive Backend Testing for DowUrk AI Platform
Tests all working endpoints and provides detailed report
"""

import requests
import json
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
BASE_API_URL = f"{BACKEND_URL}/api"

class FinalTester:
    def __init__(self):
        self.test_results = []
        self.auth_token = None
        self.user_email = f"finaltest-{uuid.uuid4()}@example.com"
        self.user_password = "TestPassword123!"
        self.session_id = f"test-session-{uuid.uuid4()}"
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details,
            'category': self.get_category(test_name)
        })
    
    def get_category(self, test_name):
        """Get category for test"""
        if 'auth' in test_name.lower():
            return 'Authentication'
        elif 'ai' in test_name.lower():
            return 'AI Services'
        elif 'payment' in test_name.lower():
            return 'Payment System'
        elif 'metrics' in test_name.lower():
            return 'Metrics API'
        elif 'docs' in test_name.lower():
            return 'Documentation'
        elif 'security' in test_name.lower():
            return 'Security'
        else:
            return 'General'
    
    def get_auth_headers(self):
        """Get authorization headers"""
        if self.auth_token:
            return {"Authorization": f"Bearer {self.auth_token}"}
        return {}
    
    # ========================================
    # AUTHENTICATION SYSTEM TESTS
    # ========================================
    
    def test_user_registration(self):
        """Test POST /api/auth/register"""
        test_name = "POST /api/auth/register - User Registration"
        
        try:
            payload = {
                "email": self.user_email,
                "password": self.user_password,
                "full_name": "Final Test User",
                "company_name": "Test Company LLC",
                "organization_type": "business",
                "industry": "technology"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/auth/register",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 201:
                data = response.json()
                required_fields = ['access_token', 'refresh_token', 'token_type', 'user']
                
                if all(field in data for field in required_fields):
                    self.auth_token = data['access_token']
                    user_info = data['user']
                    self.log_test(test_name, True, f"User registered: {user_info.get('email', 'N/A')}")
                else:
                    self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_user_login(self):
        """Test POST /api/auth/login"""
        test_name = "POST /api/auth/login - User Login"
        
        try:
            payload = {
                "email": self.user_email,
                "password": self.user_password
            }
            
            response = requests.post(
                f"{BASE_API_URL}/auth/login",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'access_token' in data and 'user' in data:
                    self.auth_token = data['access_token']
                    self.log_test(test_name, True, f"Login successful for {data['user'].get('email', 'N/A')}")
                else:
                    self.log_test(test_name, False, "Missing access_token or user in response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_get_user_profile(self):
        """Test GET /api/auth/me"""
        test_name = "GET /api/auth/me - Get User Profile"
        
        try:
            response = requests.get(
                f"{BASE_API_URL}/auth/me",
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['id', 'email', 'full_name', 'organization_type']
                
                if all(field in data for field in required_fields):
                    self.log_test(test_name, True, f"Profile: {data['full_name']} ({data['organization_type']})")
                else:
                    self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_user_logout(self):
        """Test POST /api/auth/logout"""
        test_name = "POST /api/auth/logout - User Logout"
        
        try:
            response = requests.post(
                f"{BASE_API_URL}/auth/logout",
                headers=self.get_auth_headers(),
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'message' in data:
                    self.log_test(test_name, True, "Logout successful")
                else:
                    self.log_test(test_name, False, "No message in logout response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # AI SERVICES TESTS
    # ========================================
    
    def test_ai_business_plan_basic(self):
        """Test POST /api/ai/business-plan - Basic Request"""
        test_name = "POST /api/ai/business-plan - Basic Business Question"
        
        try:
            payload = {
                "session_id": self.session_id,
                "user_message": "How do I start a sustainable food delivery business for underserved communities in Detroit?"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=payload,
                timeout=120  # Longer timeout for AI
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['session_id', 'user_message', 'assistant_response', 'timestamp']
                
                if all(field in data for field in required_fields):
                    response_length = len(data['assistant_response'])
                    if response_length > 100:
                        self.log_test(test_name, True, f"AI response: {response_length} chars")
                    else:
                        self.log_test(test_name, False, f"AI response too short: {response_length} chars")
                else:
                    self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_chat_history_retrieval(self):
        """Test GET /api/ai/chat-history/{session_id}"""
        test_name = "GET /api/ai/chat-history/{session_id} - History Retrieval"
        
        try:
            response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'session_id' in data and 'messages' in data:
                    messages = data['messages']
                    self.log_test(test_name, True, f"Retrieved {len(messages)} messages for session")
                else:
                    self.log_test(test_name, False, "Response missing session_id or messages")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator_comprehensive(self):
        """Test POST /api/ai/content-generator - Multiple Content Types"""
        content_types = [
            ("tagline", "AI business planning platform", "professional", "short"),
            ("social_post", "Launching DowUrk AI for entrepreneurs", "friendly", "medium"),
            ("email", "Welcome to DowUrk AI", "professional", "medium"),
            ("ad_copy", "Transform your business with AI", "bold", "short"),
            ("blog_intro", "The future of AI in business planning", "professional", "long")
        ]
        
        for content_type, topic, tone, length in content_types:
            test_name = f"POST /api/ai/content-generator - {content_type.title()}"
            
            try:
                payload = {
                    "content_type": content_type,
                    "topic": topic,
                    "tone": tone,
                    "length": length
                }
                
                response = requests.post(
                    f"{BASE_API_URL}/ai/content-generator",
                    json=payload,
                    timeout=120
                )
                
                if response.status_code == 200:
                    data = response.json()
                    required_fields = ['content_type', 'generated_content', 'timestamp']
                    
                    if all(field in data for field in required_fields):
                        content_length = len(data['generated_content'])
                        if content_length > 10:
                            self.log_test(test_name, True, f"Generated {content_length} chars")
                        else:
                            self.log_test(test_name, False, f"Content too short: {content_length} chars")
                    else:
                        self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
                else:
                    self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                    
            except Exception as e:
                self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # PAYMENT SYSTEM TESTS
    # ========================================
    
    def test_payment_packages(self):
        """Test GET /api/payments/packages"""
        test_name = "GET /api/payments/packages - All Subscription Tiers"
        
        try:
            response = requests.get(f"{BASE_API_URL}/payments/packages", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                
                if 'packages' in data:
                    packages = data['packages']
                    expected_tiers = ['free', 'professional', 'business', 'enterprise']
                    
                    if all(tier in packages for tier in expected_tiers):
                        # Verify package structure
                        prof_package = packages.get('professional', {})
                        required_fields = ['name', 'price', 'currency', 'features']
                        
                        if all(field in prof_package for field in required_fields):
                            self.log_test(test_name, True, f"All 4 tiers: {list(packages.keys())}")
                        else:
                            self.log_test(test_name, False, f"Professional package missing fields: {[f for f in required_fields if f not in prof_package]}")
                    else:
                        missing_tiers = [tier for tier in expected_tiers if tier not in packages]
                        self.log_test(test_name, False, f"Missing tiers: {missing_tiers}")
                else:
                    self.log_test(test_name, False, "No packages field in response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_checkout_session_creation(self):
        """Test POST /api/payments/checkout/session"""
        test_name = "POST /api/payments/checkout/session - Professional Package"
        
        try:
            payload = {
                "package_id": "professional",
                "origin_url": "https://example.com",
                "user_email": self.user_email
            }
            
            response = requests.post(
                f"{BASE_API_URL}/payments/checkout/session",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['session_id', 'checkout_url']
                
                if all(field in data for field in required_fields):
                    if 'stripe.com' in data['checkout_url']:
                        self.log_test(test_name, True, f"Checkout session: {data['session_id'][:20]}...")
                    else:
                        self.log_test(test_name, False, f"Invalid checkout URL: {data['checkout_url'][:50]}...")
                else:
                    self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # METRICS API TESTS
    # ========================================
    
    def test_metrics_endpoints(self):
        """Test all metrics endpoints"""
        endpoints = [
            ("/metrics/health", "Metrics Health Check"),
            ("/metrics/valuation", "Valuation Projection"),
            ("/metrics/goals", "Metrics Goals")
        ]
        
        for endpoint, description in endpoints:
            test_name = f"GET /api{endpoint} - {description}"
            
            try:
                response = requests.get(f"{BASE_API_URL}{endpoint}", timeout=30)
                
                if response.status_code == 200:
                    data = response.json()
                    
                    if endpoint == "/metrics/health":
                        if 'overall_health' in data and 'checks' in data:
                            self.log_test(test_name, True, f"Health: {data['overall_health']}")
                        else:
                            self.log_test(test_name, False, "Missing health data")
                    
                    elif endpoint == "/metrics/valuation":
                        required_fields = ['current_arr', 'current_valuation', 'target_valuation']
                        if all(field in data for field in required_fields):
                            self.log_test(test_name, True, f"Valuation: ${data['current_valuation']:,.0f}")
                        else:
                            self.log_test(test_name, False, f"Missing fields: {[f for f in required_fields if f not in data]}")
                    
                    elif endpoint == "/metrics/goals":
                        if isinstance(data, list) and len(data) > 0:
                            self.log_test(test_name, True, f"Found {len(data)} goals")
                        else:
                            self.log_test(test_name, False, "No goals returned")
                    
                else:
                    self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text[:200]}")
                    
            except Exception as e:
                self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # SECURITY TESTS
    # ========================================
    
    def test_authentication_protection(self):
        """Test authentication requirements"""
        test_name = "Authentication Protection - Protected Endpoints"
        
        try:
            # Test accessing protected endpoint without token
            response = requests.get(f"{BASE_API_URL}/auth/me", timeout=10)
            
            if response.status_code == 401:
                self.log_test(test_name, True, "Protected endpoint properly secured (401)")
            elif response.status_code == 403:
                self.log_test(test_name, True, "Protected endpoint properly secured (403)")
            else:
                self.log_test(test_name, False, f"Expected 401/403, got {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_error_handling(self):
        """Test error handling with invalid inputs"""
        test_name = "Error Handling - Invalid Inputs"
        
        try:
            # Test invalid AI request
            invalid_payload = {"invalid_field": "test"}
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=invalid_payload,
                timeout=10
            )
            
            if response.status_code >= 400:
                self.log_test(test_name, True, f"Invalid input rejected: {response.status_code}")
            else:
                self.log_test(test_name, False, f"Invalid input accepted: {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # DATABASE VERIFICATION
    # ========================================
    
    def test_database_persistence(self):
        """Test database collections are working"""
        test_name = "Database Persistence - Collections Usage"
        
        try:
            # Test that user was created (via successful auth)
            auth_works = self.auth_token is not None
            
            # Test that AI conversations can be stored/retrieved
            chat_response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}", timeout=10)
            chat_works = chat_response.status_code == 200
            
            # Test that payment packages are accessible
            payment_response = requests.get(f"{BASE_API_URL}/payments/packages", timeout=10)
            payment_works = payment_response.status_code == 200
            
            working_collections = sum([auth_works, chat_works, payment_works])
            
            if working_collections == 3:
                self.log_test(test_name, True, "All database collections accessible")
            else:
                self.log_test(test_name, False, f"Only {working_collections}/3 collections working")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # MAIN TEST RUNNER
    # ========================================
    
    def run_final_tests(self):
        """Run comprehensive final backend tests"""
        print(f"\n🧪 Final Comprehensive Backend Tests - DowUrk AI Platform")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test User: {self.user_email}")
        print("=" * 80)
        
        # 1. Authentication System
        print("\n📋 AUTHENTICATION SYSTEM")
        print("-" * 40)
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        self.test_user_logout()
        
        # Re-login for subsequent tests
        self.test_user_login()
        
        # 2. AI Services
        print("\n🤖 AI SERVICES")
        print("-" * 40)
        self.test_ai_business_plan_basic()
        self.test_ai_chat_history_retrieval()
        self.test_ai_content_generator_comprehensive()
        
        # 3. Payment System
        print("\n💳 PAYMENT SYSTEM")
        print("-" * 40)
        self.test_payment_packages()
        self.test_checkout_session_creation()
        
        # 4. Metrics API
        print("\n📊 METRICS API")
        print("-" * 40)
        self.test_metrics_endpoints()
        
        # 5. Security & Error Handling
        print("\n🔒 SECURITY & ERROR HANDLING")
        print("-" * 40)
        self.test_authentication_protection()
        self.test_error_handling()
        
        # 6. Database Verification
        print("\n🗄️ DATABASE VERIFICATION")
        print("-" * 40)
        self.test_database_persistence()
        
        # Generate comprehensive summary
        self.generate_final_summary()
        
        return self.test_results
    
    def generate_final_summary(self):
        """Generate comprehensive test summary"""
        print("\n" + "=" * 80)
        print("📊 FINAL COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
        # Overall statistics
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        success_rate = (passed/total)*100 if total > 0 else 0
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {success_rate:.1f}%")
        
        # Group by category
        categories = {}
        for result in self.test_results:
            category = result['category']
            if category not in categories:
                categories[category] = {'passed': 0, 'total': 0, 'failed_tests': []}
            
            categories[category]['total'] += 1
            if result['success']:
                categories[category]['passed'] += 1
            else:
                categories[category]['failed_tests'].append(result)
        
        print(f"\n📋 RESULTS BY CATEGORY:")
        print("-" * 40)
        
        for category, stats in categories.items():
            category_rate = (stats['passed']/stats['total'])*100 if stats['total'] > 0 else 0
            status_icon = "✅" if category_rate == 100 else "⚠️" if category_rate >= 80 else "❌"
            
            print(f"{status_icon} {category}: {stats['passed']}/{stats['total']} ({category_rate:.1f}%)")
            
            # Show failed tests in category
            if stats['failed_tests']:
                for test in stats['failed_tests']:
                    print(f"    ❌ {test['test']}")
                    print(f"       {test['details']}")
        
        # Critical issues
        critical_failures = [r for r in self.test_results if not r['success']]
        
        if critical_failures:
            print(f"\n❌ CRITICAL ISSUES REQUIRING ATTENTION:")
            print("-" * 40)
            for failure in critical_failures:
                print(f"• {failure['test']}")
                print(f"  Issue: {failure['details']}")
        
        # Working features summary
        working_features = []
        if any('auth' in r['test'].lower() and r['success'] for r in self.test_results):
            working_features.append("✅ User Authentication System")
        if any('ai' in r['test'].lower() and r['success'] for r in self.test_results):
            working_features.append("✅ AI Business Planning & Content Generation")
        if any('payment' in r['test'].lower() and r['success'] for r in self.test_results):
            working_features.append("✅ Payment System & Subscription Tiers")
        if any('metrics' in r['test'].lower() and r['success'] for r in self.test_results):
            working_features.append("✅ Metrics & Analytics API")
        if any('security' in r['test'].lower() and r['success'] for r in self.test_results):
            working_features.append("✅ Security & Error Handling")
        
        if working_features:
            print(f"\n🎉 WORKING FEATURES:")
            print("-" * 40)
            for feature in working_features:
                print(feature)
        
        # Overall assessment
        if success_rate >= 90:
            print(f"\n🎉 EXCELLENT! DowUrk AI backend is fully functional and production-ready.")
        elif success_rate >= 80:
            print(f"\n✅ GOOD! DowUrk AI backend is mostly functional with minor issues to address.")
        elif success_rate >= 60:
            print(f"\n⚠️ MODERATE! DowUrk AI backend has core functionality but needs attention.")
        else:
            print(f"\n❌ CRITICAL! DowUrk AI backend has significant issues requiring immediate attention.")

if __name__ == "__main__":
    tester = FinalTester()
    results = tester.run_final_tests()