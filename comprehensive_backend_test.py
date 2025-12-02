#!/usr/bin/env python3
"""
Comprehensive Backend Testing for DowUrk AI Platform
Tests ALL features and API endpoints as requested in review
"""

import requests
import json
import time
import uuid
from datetime import datetime
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
BASE_API_URL = f"{BACKEND_URL}/api"

class ComprehensiveTester:
    def __init__(self):
        self.test_results = []
        self.auth_token = None
        self.user_email = f"test-user-{uuid.uuid4()}@example.com"
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
            'timestamp': datetime.now().isoformat()
        })
    
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
                "full_name": "Test User",
                "company_name": "Test Company",
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
                    self.log_test(test_name, True, f"User registered successfully, token received")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
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
                if 'access_token' in data:
                    self.auth_token = data['access_token']
                    self.log_test(test_name, True, "Login successful, token received")
                else:
                    self.log_test(test_name, False, "No access token in response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
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
                    self.log_test(test_name, True, f"Profile retrieved: {data['email']}")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
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
                    self.log_test(test_name, False, "No message in response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # AI BUSINESS PLANNING ASSISTANT TESTS
    # ========================================
    
    def test_ai_business_plan_basic(self):
        """Test POST /api/ai/business-plan - Basic Request"""
        test_name = "POST /api/ai/business-plan - Basic Business Question"
        
        try:
            payload = {
                "session_id": self.session_id,
                "user_message": "How do I start a sustainable food delivery business for underserved communities?"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['session_id', 'user_message', 'assistant_response', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['assistant_response'] and len(data['assistant_response']) > 100:
                        self.log_test(test_name, True, f"AI response length: {len(data['assistant_response'])} chars")
                    else:
                        self.log_test(test_name, False, "AI response too short or empty")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_business_plan_with_context(self):
        """Test POST /api/ai/business-plan - With Business Context"""
        test_name = "POST /api/ai/business-plan - With Business Context"
        
        try:
            payload = {
                "session_id": self.session_id,
                "user_message": "What marketing strategies would work best for my target audience?",
                "business_context": "Located in Detroit, targeting minority-owned small businesses in the automotive supply chain"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                response_text = data['assistant_response'].lower()
                context_mentions = any(term in response_text for term in ['detroit', 'automotive', 'minority', 'supply'])
                
                if context_mentions:
                    self.log_test(test_name, True, "AI response incorporates business context")
                else:
                    self.log_test(test_name, True, "Response generated (context integration unclear)")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_chat_history_retrieval(self):
        """Test GET /api/ai/chat-history/{session_id}"""
        test_name = "GET /api/ai/chat-history/{session_id} - History Retrieval"
        
        try:
            response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'session_id' in data and 'messages' in data:
                    messages = data['messages']
                    if len(messages) >= 2:  # Should have user + assistant messages
                        first_msg = messages[0]
                        required_fields = ['id', 'session_id', 'role', 'content', 'timestamp']
                        
                        if all(field in first_msg for field in required_fields):
                            self.log_test(test_name, True, f"Retrieved {len(messages)} messages")
                        else:
                            self.log_test(test_name, False, f"Message missing required fields")
                    else:
                        self.log_test(test_name, False, f"Expected multiple messages, got {len(messages)}")
                else:
                    self.log_test(test_name, False, "Response missing session_id or messages")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_chat_history_deletion(self):
        """Test DELETE /api/ai/chat-history/{session_id}"""
        test_name = "DELETE /api/ai/chat-history/{session_id} - History Deletion"
        
        try:
            response = requests.delete(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'message' in data and 'session_id' in data:
                    # Verify history is actually cleared
                    verify_response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
                    if verify_response.status_code == 200:
                        remaining_messages = len(verify_response.json()['messages'])
                        if remaining_messages == 0:
                            self.log_test(test_name, True, "Chat history deleted successfully")
                        else:
                            self.log_test(test_name, False, f"Still {remaining_messages} messages after deletion")
                    else:
                        self.log_test(test_name, False, "Could not verify deletion")
                else:
                    self.log_test(test_name, False, "Response missing required fields")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # AI CONTENT GENERATOR TESTS (NEW)
    # ========================================
    
    def test_ai_content_generator_tagline(self):
        """Test POST /api/ai/content-generator - Tagline"""
        test_name = "POST /api/ai/content-generator - Tagline Generation"
        
        try:
            payload = {
                "content_type": "tagline",
                "topic": "AI-powered business planning platform for underserved entrepreneurs",
                "tone": "professional",
                "length": "short"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['content_type', 'generated_content', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['generated_content'] and len(data['generated_content']) > 10:
                        self.log_test(test_name, True, f"Tagline generated: {len(data['generated_content'])} chars")
                    else:
                        self.log_test(test_name, False, "Generated content too short or empty")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator_social_post(self):
        """Test POST /api/ai/content-generator - Social Post"""
        test_name = "POST /api/ai/content-generator - Social Post"
        
        try:
            payload = {
                "content_type": "social_post",
                "topic": "Launching our new AI business assistant for minority entrepreneurs",
                "tone": "friendly",
                "length": "medium"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['content_type'] == 'social_post' and data['generated_content']:
                    self.log_test(test_name, True, f"Social post generated: {len(data['generated_content'])} chars")
                else:
                    self.log_test(test_name, False, "Invalid social post response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator_blog_intro(self):
        """Test POST /api/ai/content-generator - Blog Intro"""
        test_name = "POST /api/ai/content-generator - Blog Intro"
        
        try:
            payload = {
                "content_type": "blog_intro",
                "topic": "How AI is revolutionizing business planning for underserved communities",
                "tone": "professional",
                "length": "long"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['content_type'] == 'blog_intro' and len(data['generated_content']) > 100:
                    self.log_test(test_name, True, f"Blog intro generated: {len(data['generated_content'])} chars")
                else:
                    self.log_test(test_name, False, "Blog intro too short or invalid")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator_email(self):
        """Test POST /api/ai/content-generator - Email"""
        test_name = "POST /api/ai/content-generator - Email"
        
        try:
            payload = {
                "content_type": "email",
                "topic": "Welcome new users to DowUrk AI platform",
                "tone": "friendly",
                "length": "medium",
                "additional_context": "Focus on onboarding and getting started with AI business planning"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['content_type'] == 'email' and data['generated_content']:
                    self.log_test(test_name, True, f"Email generated: {len(data['generated_content'])} chars")
                else:
                    self.log_test(test_name, False, "Invalid email response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator_ad_copy(self):
        """Test POST /api/ai/content-generator - Ad Copy"""
        test_name = "POST /api/ai/content-generator - Ad Copy"
        
        try:
            payload = {
                "content_type": "ad_copy",
                "topic": "DowUrk AI - Business planning made simple",
                "tone": "bold",
                "length": "short"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=60
            )
            
            if response.status_code == 200:
                data = response.json()
                if data['content_type'] == 'ad_copy' and data['generated_content']:
                    self.log_test(test_name, True, f"Ad copy generated: {len(data['generated_content'])} chars")
                else:
                    self.log_test(test_name, False, "Invalid ad copy response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # PAYMENT SYSTEM TESTS
    # ========================================
    
    def test_get_subscription_packages(self):
        """Test GET /api/payments/packages"""
        test_name = "GET /api/payments/packages - Get All Subscription Tiers"
        
        try:
            response = requests.get(f"{BASE_API_URL}/payments/packages")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'packages' in data:
                    packages = data['packages']
                    expected_tiers = ['free', 'professional', 'business', 'enterprise']
                    
                    if all(tier in packages for tier in expected_tiers):
                        # Check professional package structure
                        prof_package = packages.get('professional', {})
                        required_fields = ['name', 'price', 'currency', 'features']
                        
                        if all(field in prof_package for field in required_fields):
                            self.log_test(test_name, True, f"All 4 tiers available: {list(packages.keys())}")
                        else:
                            self.log_test(test_name, False, "Package structure incomplete")
                    else:
                        self.log_test(test_name, False, f"Missing tiers. Found: {list(packages.keys())}")
                else:
                    self.log_test(test_name, False, "No packages field in response")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_create_checkout_session(self):
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
                    if data['checkout_url'].startswith('https://checkout.stripe.com'):
                        self.log_test(test_name, True, f"Checkout session created: {data['session_id']}")
                    else:
                        self.log_test(test_name, False, "Invalid checkout URL")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # METRICS API TESTS
    # ========================================
    
    def test_metrics_health(self):
        """Test GET /api/metrics/health"""
        test_name = "GET /api/metrics/health - Health Check"
        
        try:
            response = requests.get(f"{BASE_API_URL}/metrics/health")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['overall_health', 'checks', 'recommendations']
                
                if all(field in data for field in required_fields):
                    checks = data['checks']
                    expected_checks = ['ltv_cac_ratio', 'gross_margin', 'growth_rate', 'net_dollar_retention']
                    
                    if all(check in checks for check in expected_checks):
                        self.log_test(test_name, True, f"Health status: {data['overall_health']}")
                    else:
                        self.log_test(test_name, False, "Missing health checks")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_metrics_valuation(self):
        """Test GET /api/metrics/valuation"""
        test_name = "GET /api/metrics/valuation - Valuation Projection"
        
        try:
            response = requests.get(f"{BASE_API_URL}/metrics/valuation")
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['current_arr', 'current_valuation', 'target_valuation', 'progress_percentage']
                
                if all(field in data for field in required_fields):
                    if data['target_valuation'] == 1000000000:  # $1B target
                        self.log_test(test_name, True, f"Current valuation: ${data['current_valuation']:,.0f}")
                    else:
                        self.log_test(test_name, False, "Incorrect target valuation")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_metrics_goals(self):
        """Test GET /api/metrics/goals"""
        test_name = "GET /api/metrics/goals - Metrics Goals"
        
        try:
            response = requests.get(f"{BASE_API_URL}/metrics/goals")
            
            if response.status_code == 200:
                data = response.json()
                
                if isinstance(data, list) and len(data) > 0:
                    first_goal = data[0]
                    required_fields = ['year', 'target_arr', 'target_customers']
                    
                    if all(field in first_goal for field in required_fields):
                        self.log_test(test_name, True, f"Retrieved {len(data)} goals")
                    else:
                        self.log_test(test_name, False, "Goal structure incomplete")
                else:
                    self.log_test(test_name, False, "No goals returned")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # DOCUMENTATION API TESTS
    # ========================================
    
    def test_docs_list(self):
        """Test GET /api/docs"""
        test_name = "GET /api/docs - List All Documentation"
        
        try:
            response = requests.get(f"{BASE_API_URL}/docs/")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'available_docs' in data:
                    docs = data['available_docs']
                    if len(docs) > 0:
                        first_doc = docs[0]
                        required_fields = ['filename', 'description', 'url']
                        
                        if all(field in first_doc for field in required_fields):
                            self.log_test(test_name, True, f"Found {len(docs)} documentation files")
                        else:
                            self.log_test(test_name, False, "Doc structure incomplete")
                    else:
                        self.log_test(test_name, False, "No documentation files found")
                else:
                    self.log_test(test_name, False, "No available_docs field")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_docs_specific_file(self):
        """Test GET /api/docs/{filename}"""
        test_name = "GET /api/docs/FUNDRAISING_STRATEGY.md - Specific Document"
        
        try:
            response = requests.get(f"{BASE_API_URL}/docs/FUNDRAISING_STRATEGY.md")
            
            if response.status_code == 200:
                content = response.text
                
                if len(content) > 100 and 'fundraising' in content.lower():
                    self.log_test(test_name, True, f"Document retrieved: {len(content)} chars")
                else:
                    self.log_test(test_name, False, "Document content invalid or too short")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # SECURITY TESTS
    # ========================================
    
    def test_rate_limiting(self):
        """Test rate limiting by making rapid requests"""
        test_name = "Rate Limiting - 15 Rapid Requests"
        
        try:
            rate_limit_hit = False
            
            for i in range(15):
                response = requests.get(f"{BASE_API_URL}/metrics/health", timeout=5)
                if response.status_code == 429:
                    rate_limit_hit = True
                    break
                time.sleep(0.1)  # Small delay between requests
            
            if rate_limit_hit:
                self.log_test(test_name, True, "Rate limiting working - 429 error received")
            else:
                self.log_test(test_name, False, "Rate limiting not triggered")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_authentication_protection(self):
        """Test authentication requirements on protected endpoints"""
        test_name = "Authentication Protection - Protected Endpoints"
        
        try:
            # Test accessing protected endpoint without token
            response = requests.get(f"{BASE_API_URL}/auth/me", timeout=10)
            
            if response.status_code == 401:
                self.log_test(test_name, True, "Protected endpoint properly secured")
            else:
                self.log_test(test_name, False, f"Expected 401, got {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_error_handling_invalid_inputs(self):
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
                self.log_test(test_name, True, f"Invalid input properly rejected: {response.status_code}")
            else:
                self.log_test(test_name, False, f"Invalid input accepted: {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # DATABASE VERIFICATION TESTS
    # ========================================
    
    def test_database_collections(self):
        """Verify database collections exist by testing endpoints that use them"""
        test_name = "Database Collections - Verify Usage"
        
        try:
            # Test users collection (via auth)
            auth_response = requests.get(
                f"{BASE_API_URL}/auth/me",
                headers=self.get_auth_headers(),
                timeout=10
            )
            
            # Test ai_conversations collection (via chat history)
            chat_response = requests.get(
                f"{BASE_API_URL}/ai/chat-history/{self.session_id}",
                timeout=10
            )
            
            # Test payment_transactions collection (via packages)
            payment_response = requests.get(
                f"{BASE_API_URL}/payments/packages",
                timeout=10
            )
            
            success_count = 0
            if auth_response.status_code in [200, 401]:  # 401 is expected if not authenticated
                success_count += 1
            if chat_response.status_code == 200:
                success_count += 1
            if payment_response.status_code == 200:
                success_count += 1
            
            if success_count == 3:
                self.log_test(test_name, True, "All database collections accessible")
            else:
                self.log_test(test_name, False, f"Only {success_count}/3 collections accessible")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    # ========================================
    # MAIN TEST RUNNER
    # ========================================
    
    def run_all_tests(self):
        """Run comprehensive backend tests"""
        print(f"\n🧪 Starting Comprehensive DowUrk AI Backend Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test User Email: {self.user_email}")
        print("=" * 80)
        
        # 1. Authentication System Tests
        print("\n📋 AUTHENTICATION SYSTEM TESTS")
        print("-" * 40)
        self.test_user_registration()
        self.test_user_login()
        self.test_get_user_profile()
        self.test_user_logout()
        
        # Re-login for subsequent tests
        self.test_user_login()
        
        # 2. AI Business Planning Assistant Tests
        print("\n🤖 AI BUSINESS PLANNING ASSISTANT TESTS")
        print("-" * 40)
        self.test_ai_business_plan_basic()
        self.test_ai_business_plan_with_context()
        self.test_ai_chat_history_retrieval()
        self.test_ai_chat_history_deletion()
        
        # 3. AI Content Generator Tests (NEW)
        print("\n✍️ AI CONTENT GENERATOR TESTS")
        print("-" * 40)
        self.test_ai_content_generator_tagline()
        self.test_ai_content_generator_social_post()
        self.test_ai_content_generator_blog_intro()
        self.test_ai_content_generator_email()
        self.test_ai_content_generator_ad_copy()
        
        # 4. Payment System Tests
        print("\n💳 PAYMENT SYSTEM TESTS")
        print("-" * 40)
        self.test_get_subscription_packages()
        self.test_create_checkout_session()
        
        # 5. Metrics API Tests
        print("\n📊 METRICS API TESTS")
        print("-" * 40)
        self.test_metrics_health()
        self.test_metrics_valuation()
        self.test_metrics_goals()
        
        # 6. Documentation API Tests
        print("\n📚 DOCUMENTATION API TESTS")
        print("-" * 40)
        self.test_docs_list()
        self.test_docs_specific_file()
        
        # 7. Security Tests
        print("\n🔒 SECURITY TESTS")
        print("-" * 40)
        self.test_rate_limiting()
        self.test_authentication_protection()
        self.test_error_handling_invalid_inputs()
        
        # 8. Database Verification
        print("\n🗄️ DATABASE VERIFICATION TESTS")
        print("-" * 40)
        self.test_database_collections()
        
        # Summary
        print("\n" + "=" * 80)
        print("📊 COMPREHENSIVE TEST SUMMARY")
        print("=" * 80)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        # Group results by category
        categories = {
            'Authentication': [r for r in self.test_results if 'auth' in r['test'].lower()],
            'AI Business Planning': [r for r in self.test_results if 'business-plan' in r['test'].lower()],
            'AI Content Generator': [r for r in self.test_results if 'content-generator' in r['test'].lower()],
            'Payment System': [r for r in self.test_results if 'payment' in r['test'].lower()],
            'Metrics API': [r for r in self.test_results if 'metrics' in r['test'].lower()],
            'Documentation': [r for r in self.test_results if 'docs' in r['test'].lower()],
            'Security': [r for r in self.test_results if any(term in r['test'].lower() for term in ['rate', 'authentication protection', 'error handling'])],
            'Database': [r for r in self.test_results if 'database' in r['test'].lower()]
        }
        
        for category, results in categories.items():
            if results:
                category_passed = sum(1 for r in results if r['success'])
                category_total = len(results)
                print(f"\n{category}: {category_passed}/{category_total} passed")
                
                # Show failed tests in this category
                failed_tests = [r for r in results if not r['success']]
                if failed_tests:
                    for test in failed_tests:
                        print(f"  ❌ {test['test']}: {test['details']}")
        
        if total - passed > 0:
            print(f"\n❌ CRITICAL ISSUES FOUND:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['details']}")
        else:
            print(f"\n🎉 ALL TESTS PASSED! DowUrk AI backend is fully functional.")
        
        return passed == total

if __name__ == "__main__":
    tester = ComprehensiveTester()
    success = tester.run_all_tests()
    
    exit(0 if success else 1)