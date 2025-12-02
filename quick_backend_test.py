#!/usr/bin/env python3
"""
Quick Backend Testing for DowUrk AI Platform
Tests core functionality with longer timeouts
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

class QuickTester:
    def __init__(self):
        self.test_results = []
        self.auth_token = None
        self.user_email = f"quicktest-{uuid.uuid4()}@example.com"
        self.user_password = "TestPassword123!"
        
    def log_test(self, test_name, success, details=""):
        """Log test results"""
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}")
        if details:
            print(f"   Details: {details}")
        
        self.test_results.append({
            'test': test_name,
            'success': success,
            'details': details
        })
    
    def test_basic_connectivity(self):
        """Test basic API connectivity"""
        test_name = "Basic API Connectivity"
        
        try:
            response = requests.get(f"{BASE_API_URL}/", timeout=30)
            
            if response.status_code == 200:
                self.log_test(test_name, True, f"API responding: {response.status_code}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_user_registration(self):
        """Test user registration"""
        test_name = "User Registration"
        
        try:
            payload = {
                "email": self.user_email,
                "password": self.user_password,
                "full_name": "Quick Test User",
                "organization_type": "business"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/auth/register",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 201:
                data = response.json()
                if 'access_token' in data:
                    self.auth_token = data['access_token']
                    self.log_test(test_name, True, "Registration successful")
                else:
                    self.log_test(test_name, False, "No access token")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_payment_packages(self):
        """Test payment packages endpoint"""
        test_name = "Payment Packages"
        
        try:
            response = requests.get(f"{BASE_API_URL}/payments/packages", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'packages' in data:
                    packages = data['packages']
                    expected_tiers = ['free', 'professional', 'business', 'enterprise']
                    if all(tier in packages for tier in expected_tiers):
                        self.log_test(test_name, True, f"All 4 tiers found")
                    else:
                        self.log_test(test_name, False, f"Missing tiers: {list(packages.keys())}")
                else:
                    self.log_test(test_name, False, "No packages field")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_metrics_health(self):
        """Test metrics health endpoint"""
        test_name = "Metrics Health"
        
        try:
            response = requests.get(f"{BASE_API_URL}/metrics/health", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'overall_health' in data and 'checks' in data:
                    self.log_test(test_name, True, f"Health: {data['overall_health']}")
                else:
                    self.log_test(test_name, False, "Missing health data")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_docs_list(self):
        """Test documentation list"""
        test_name = "Documentation List"
        
        try:
            response = requests.get(f"{BASE_API_URL}/docs/", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'available_docs' in data and len(data['available_docs']) > 0:
                    self.log_test(test_name, True, f"Found {len(data['available_docs'])} docs")
                else:
                    self.log_test(test_name, False, "No docs found")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_content_generator(self):
        """Test AI content generator (quick test)"""
        test_name = "AI Content Generator"
        
        try:
            payload = {
                "content_type": "tagline",
                "topic": "AI business platform",
                "tone": "professional",
                "length": "short"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/content-generator",
                json=payload,
                timeout=120  # Longer timeout for AI
            )
            
            if response.status_code == 200:
                data = response.json()
                if 'generated_content' in data and data['generated_content']:
                    self.log_test(test_name, True, f"Content generated: {len(data['generated_content'])} chars")
                else:
                    self.log_test(test_name, False, "No content generated")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_ai_chat_history(self):
        """Test AI chat history (without creating new conversation)"""
        test_name = "AI Chat History"
        
        try:
            session_id = f"test-{uuid.uuid4()}"
            response = requests.get(f"{BASE_API_URL}/ai/chat-history/{session_id}", timeout=30)
            
            if response.status_code == 200:
                data = response.json()
                if 'session_id' in data and 'messages' in data:
                    self.log_test(test_name, True, f"History retrieved: {len(data['messages'])} messages")
                else:
                    self.log_test(test_name, False, "Invalid response structure")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def run_quick_tests(self):
        """Run quick backend tests"""
        print(f"\n🧪 Quick Backend Tests for DowUrk AI")
        print(f"Backend URL: {BACKEND_URL}")
        print("=" * 60)
        
        # Run core tests
        self.test_basic_connectivity()
        self.test_user_registration()
        self.test_payment_packages()
        self.test_metrics_health()
        self.test_docs_list()
        self.test_ai_chat_history()
        self.test_ai_content_generator()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 QUICK TEST SUMMARY")
        print("=" * 60)
        
        passed = sum(1 for result in self.test_results if result['success'])
        total = len(self.test_results)
        
        print(f"Total Tests: {total}")
        print(f"Passed: {passed}")
        print(f"Failed: {total - passed}")
        print(f"Success Rate: {(passed/total)*100:.1f}%")
        
        if total - passed > 0:
            print("\n❌ FAILED TESTS:")
            for result in self.test_results:
                if not result['success']:
                    print(f"  • {result['test']}: {result['details']}")
        
        return passed, total, self.test_results

if __name__ == "__main__":
    tester = QuickTester()
    passed, total, results = tester.run_quick_tests()
    
    if passed == total:
        print("\n🎉 All quick tests passed!")
    else:
        print(f"\n⚠️  {total - passed} tests failed.")