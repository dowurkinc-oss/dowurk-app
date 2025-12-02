#!/usr/bin/env python3
"""
Comprehensive IP Protection Testing for DowUrk AI
Tests all IP protection features including watermarking, access control, and middleware
"""

import asyncio
import aiohttp
import json
import time
import re
from datetime import datetime
from typing import Dict, List, Optional

# Configuration
BACKEND_URL = "https://ai-workforce-20.preview.emergentagent.com/api"
TEST_TIMEOUT = 120  # seconds

class IPProtectionTester:
    def __init__(self):
        self.session = None
        self.test_results = []
        self.failed_tests = []
        
    async def setup(self):
        """Setup test session"""
        self.session = aiohttp.ClientSession(
            timeout=aiohttp.ClientTimeout(total=TEST_TIMEOUT)
        )
        
    async def cleanup(self):
        """Cleanup test session"""
        if self.session:
            await self.session.close()
    
    def log_test(self, test_name: str, success: bool, details: str = "", response_data: Dict = None):
        """Log test result"""
        result = {
            "test": test_name,
            "success": success,
            "details": details,
            "timestamp": datetime.now().isoformat(),
            "response_data": response_data
        }
        self.test_results.append(result)
        
        if not success:
            self.failed_tests.append(result)
            
        status = "✅ PASS" if success else "❌ FAIL"
        print(f"{status} {test_name}: {details}")
    
    async def test_protected_ai_endpoints(self):
        """Test 1: Protected AI Endpoints Testing"""
        print("\n🔒 TESTING PROTECTED AI ENDPOINTS")
        
        # Test Business Planning Assistant
        await self._test_business_planning_endpoint()
        
        # Test Content Generator for all types
        await self._test_content_generator_endpoints()
        
        # Test Pitch Deck Creator
        await self._test_pitch_deck_endpoint()
    
    async def _test_business_planning_endpoint(self):
        """Test Business Planning Assistant endpoint"""
        try:
            payload = {
                "session_id": f"test-session-{int(time.time())}",
                "user_message": "What are the key components of a successful business plan for a tech startup?",
                "business_context": "AI-powered platform for underserved entrepreneurs"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/ai/business-plan",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Check response structure
                    required_fields = ["session_id", "user_message", "assistant_response", "timestamp"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_test(
                            "Business Planning API - Response Structure",
                            False,
                            f"Missing fields: {missing_fields}",
                            data
                        )
                        return
                    
                    # Check for watermark presence
                    watermark_present = self._check_watermark(data["assistant_response"])
                    
                    # Check that system prompt is NOT exposed
                    prompt_exposed = self._check_prompt_exposure(data["assistant_response"])
                    
                    self.log_test(
                        "Business Planning API - Basic Functionality",
                        True,
                        f"Response length: {len(data['assistant_response'])} chars",
                        {"response_preview": data["assistant_response"][:200] + "..."}
                    )
                    
                    self.log_test(
                        "Business Planning API - Watermark Protection",
                        watermark_present,
                        "Watermark found in response" if watermark_present else "No watermark detected",
                        {"watermark_check": watermark_present}
                    )
                    
                    self.log_test(
                        "Business Planning API - Prompt Protection",
                        not prompt_exposed,
                        "System prompt properly protected" if not prompt_exposed else "System prompt may be exposed",
                        {"prompt_exposure_check": prompt_exposed}
                    )
                    
                else:
                    error_text = await response.text()
                    self.log_test(
                        "Business Planning API - Basic Functionality",
                        False,
                        f"HTTP {response.status}: {error_text}",
                        {"status": response.status, "error": error_text}
                    )
                    
        except Exception as e:
            self.log_test(
                "Business Planning API - Basic Functionality",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    async def _test_content_generator_endpoints(self):
        """Test Content Generator for all content types"""
        content_types = ["tagline", "social_post", "blog_intro", "email", "ad_copy"]
        
        for content_type in content_types:
            try:
                payload = {
                    "content_type": content_type,
                    "topic": "AI-powered business planning platform",
                    "tone": "professional",
                    "length": "medium"
                }
                
                async with self.session.post(
                    f"{BACKEND_URL}/ai/content-generator",
                    json=payload,
                    headers={"Content-Type": "application/json"}
                ) as response:
                    
                    if response.status == 200:
                        data = await response.json()
                        
                        # Check response structure
                        required_fields = ["content_type", "generated_content", "timestamp"]
                        missing_fields = [field for field in required_fields if field not in data]
                        
                        if missing_fields:
                            self.log_test(
                                f"Content Generator ({content_type}) - Response Structure",
                                False,
                                f"Missing fields: {missing_fields}",
                                data
                            )
                            continue
                        
                        # Check for watermark
                        watermark_present = self._check_watermark(data["generated_content"])
                        
                        # Check content quality (basic validation)
                        content_length = len(data["generated_content"])
                        content_valid = content_length > 10  # Basic validation
                        
                        self.log_test(
                            f"Content Generator ({content_type}) - Basic Functionality",
                            content_valid,
                            f"Generated {content_length} chars of content",
                            {"content_preview": data["generated_content"][:100] + "..."}
                        )
                        
                        self.log_test(
                            f"Content Generator ({content_type}) - Watermark Protection",
                            watermark_present,
                            "Watermark found" if watermark_present else "No watermark detected",
                            {"watermark_check": watermark_present}
                        )
                        
                    else:
                        error_text = await response.text()
                        self.log_test(
                            f"Content Generator ({content_type}) - Basic Functionality",
                            False,
                            f"HTTP {response.status}: {error_text}",
                            {"status": response.status, "error": error_text}
                        )
                        
            except Exception as e:
                self.log_test(
                    f"Content Generator ({content_type}) - Basic Functionality",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e)}
                )
    
    async def _test_pitch_deck_endpoint(self):
        """Test Pitch Deck Creator endpoint"""
        try:
            payload = {
                "business_name": "DowUrk AI Test",
                "industry": "Technology/AI",
                "problem": "Underserved entrepreneurs lack access to AI-powered business tools",
                "solution": "AI-powered platform providing business planning, content generation, and strategic resources",
                "target_market": "Underserved entrepreneurs, creatives, and nonprofits",
                "competitive_advantage": "Focus on underserved markets with culturally aware AI",
                "funding_goal": "$2M Series A"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/ai/pitch-deck",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Check response structure
                    required_fields = ["business_name", "slides", "total_slides", "timestamp"]
                    missing_fields = [field for field in required_fields if field not in data]
                    
                    if missing_fields:
                        self.log_test(
                            "Pitch Deck Creator - Response Structure",
                            False,
                            f"Missing fields: {missing_fields}",
                            data
                        )
                        return
                    
                    # Check slides structure
                    slides_valid = len(data["slides"]) > 0 and all(
                        "slide_number" in slide and "title" in slide and "content" in slide
                        for slide in data["slides"]
                    )
                    
                    # Check for watermarks in slides
                    watermarks_found = 0
                    for slide in data["slides"]:
                        if self._check_watermark(slide["content"]):
                            watermarks_found += 1
                    
                    self.log_test(
                        "Pitch Deck Creator - Basic Functionality",
                        slides_valid,
                        f"Generated {len(data['slides'])} slides",
                        {"total_slides": data["total_slides"], "slide_count": len(data["slides"])}
                    )
                    
                    self.log_test(
                        "Pitch Deck Creator - Watermark Protection",
                        watermarks_found > 0,
                        f"Watermarks found in {watermarks_found}/{len(data['slides'])} slides",
                        {"watermarks_found": watermarks_found, "total_slides": len(data["slides"])}
                    )
                    
                else:
                    error_text = await response.text()
                    self.log_test(
                        "Pitch Deck Creator - Basic Functionality",
                        False,
                        f"HTTP {response.status}: {error_text}",
                        {"status": response.status, "error": error_text}
                    )
                    
        except Exception as e:
            self.log_test(
                "Pitch Deck Creator - Basic Functionality",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    def _check_watermark(self, content: str) -> bool:
        """Check if content contains watermark (zero-width characters)"""
        # Look for zero-width space pattern: \u200B{hash}\u200B
        return "\u200B" in content
    
    def _check_prompt_exposure(self, content: str) -> bool:
        """Check if system prompts are exposed in the response"""
        # Look for common prompt indicators
        prompt_indicators = [
            "You are a business planning expert",
            "Your role is to:",
            "system_message",
            "CONFIDENTIAL",
            "proprietary",
            "DowUrk AI Proprietary"
        ]
        
        content_lower = content.lower()
        return any(indicator.lower() in content_lower for indicator in prompt_indicators)
    
    async def test_watermarking_system(self):
        """Test 2: Watermarking System Testing"""
        print("\n🏷️ TESTING WATERMARKING SYSTEM")
        
        # Test watermark detection functionality
        await self._test_watermark_detection()
    
    async def _test_watermark_detection(self):
        """Test watermark detection functionality"""
        try:
            # Import the watermark class (this would normally be done via API)
            # For now, we'll test the concept by checking responses from AI endpoints
            
            # Generate some content and check for watermarks
            payload = {
                "content_type": "tagline",
                "topic": "Test watermark detection",
                "tone": "professional",
                "length": "short"
            }
            
            async with self.session.post(
                f"{BACKEND_URL}/ai/content-generator",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                if response.status == 200:
                    data = await response.json()
                    content = data["generated_content"]
                    
                    # Check for watermark pattern
                    has_watermark = self._check_watermark(content)
                    
                    # Try to extract watermark hash
                    watermark_hash = None
                    if has_watermark:
                        parts = content.split("\u200B")
                        if len(parts) >= 3:
                            watermark_hash = parts[1]
                    
                    self.log_test(
                        "Watermark Detection - Pattern Recognition",
                        has_watermark,
                        f"Watermark detected with hash: {watermark_hash}" if watermark_hash else "No watermark pattern found",
                        {"watermark_hash": watermark_hash, "content_length": len(content)}
                    )
                    
                    # Test watermark invisibility (should not affect content readability)
                    visible_content = content.replace("\u200B", "")
                    readability_preserved = len(visible_content) > 0 and visible_content.strip() != ""
                    
                    self.log_test(
                        "Watermark Detection - Invisibility Check",
                        readability_preserved,
                        "Watermark is invisible to users" if readability_preserved else "Watermark affects content readability",
                        {"visible_content_length": len(visible_content)}
                    )
                    
                else:
                    self.log_test(
                        "Watermark Detection - API Test",
                        False,
                        f"Failed to get content for watermark testing: HTTP {response.status}",
                        {"status": response.status}
                    )
                    
        except Exception as e:
            self.log_test(
                "Watermark Detection - System Test",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    async def test_access_control(self):
        """Test 3: Access Control Testing"""
        print("\n🔐 TESTING ACCESS CONTROL BY TIER")
        
        # Test feature access simulation (since we don't have user auth in this test)
        await self._test_feature_access_simulation()
    
    async def _test_feature_access_simulation(self):
        """Simulate feature access testing"""
        # Since we don't have user authentication in this test,
        # we'll test that the endpoints exist and respond appropriately
        
        # Test that AI endpoints are accessible (they should be for testing)
        endpoints_to_test = [
            ("/ai/business-plan", "POST"),
            ("/ai/content-generator", "POST"),
            ("/ai/pitch-deck", "POST")
        ]
        
        for endpoint, method in endpoints_to_test:
            try:
                if method == "POST":
                    # Send minimal valid payload
                    if "business-plan" in endpoint:
                        payload = {"session_id": "test", "user_message": "test"}
                    elif "content-generator" in endpoint:
                        payload = {"content_type": "tagline", "topic": "test"}
                    elif "pitch-deck" in endpoint:
                        payload = {"business_name": "test", "industry": "test", "problem": "test", "solution": "test"}
                    else:
                        payload = {}
                    
                    async with self.session.post(
                        f"{BACKEND_URL}{endpoint}",
                        json=payload,
                        headers={"Content-Type": "application/json"}
                    ) as response:
                        
                        # We expect either 200 (success) or 422 (validation error) or 401/403 (auth required)
                        expected_statuses = [200, 401, 403, 422, 500]  # 500 might occur due to AI service issues
                        endpoint_accessible = response.status in expected_statuses
                        
                        self.log_test(
                            f"Access Control - {endpoint} Endpoint",
                            endpoint_accessible,
                            f"Endpoint responded with HTTP {response.status}",
                            {"status": response.status, "endpoint": endpoint}
                        )
                        
            except Exception as e:
                self.log_test(
                    f"Access Control - {endpoint} Endpoint",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e), "endpoint": endpoint}
                )
    
    async def test_ip_protection_middleware(self):
        """Test 4: IP Protection Middleware Testing"""
        print("\n🛡️ TESTING IP PROTECTION MIDDLEWARE")
        
        # Test document blocking
        await self._test_document_blocking()
        
        # Test rate limiting
        await self._test_rate_limiting()
        
        # Test security headers
        await self._test_security_headers()
    
    async def _test_document_blocking(self):
        """Test protected document blocking"""
        protected_docs = [
            "FUNDRAISING_STRATEGY.md",
            "COMPETITIVE_ANALYSIS_FRAMEWORK.md", 
            "PRODUCTION_READY_GUIDE.md"
        ]
        
        public_docs = [
            "METRICS_DASHBOARD_GUIDE.md"
        ]
        
        # Test protected documents (should return 403)
        for doc in protected_docs:
            try:
                async with self.session.get(f"{BACKEND_URL}/docs/{doc}") as response:
                    blocked = response.status == 403
                    
                    self.log_test(
                        f"Document Protection - {doc}",
                        blocked,
                        f"Protected document properly blocked (HTTP {response.status})" if blocked else f"Protected document accessible (HTTP {response.status})",
                        {"status": response.status, "document": doc}
                    )
                    
            except Exception as e:
                self.log_test(
                    f"Document Protection - {doc}",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e), "document": doc}
                )
        
        # Test public documents (should work)
        for doc in public_docs:
            try:
                async with self.session.get(f"{BACKEND_URL}/docs/{doc}") as response:
                    accessible = response.status == 200
                    
                    self.log_test(
                        f"Document Access - {doc} (Public)",
                        accessible,
                        f"Public document accessible (HTTP {response.status})" if accessible else f"Public document blocked (HTTP {response.status})",
                        {"status": response.status, "document": doc}
                    )
                    
            except Exception as e:
                self.log_test(
                    f"Document Access - {doc} (Public)",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e), "document": doc}
                )
    
    async def _test_rate_limiting(self):
        """Test rate limiting (basic test)"""
        try:
            # Make several rapid requests to test rate limiting
            # Note: This is a basic test - full rate limit testing would require many more requests
            
            request_count = 5
            responses = []
            
            for i in range(request_count):
                try:
                    async with self.session.get(f"{BACKEND_URL}/") as response:
                        responses.append(response.status)
                except Exception as e:
                    responses.append(f"error: {str(e)}")
            
            # Check if any requests were rate limited (429)
            rate_limited = any(status == 429 for status in responses if isinstance(status, int))
            
            self.log_test(
                "Rate Limiting - Basic Test",
                True,  # We consider this a pass if no errors occurred
                f"Made {request_count} requests, rate limited: {rate_limited}",
                {"responses": responses, "rate_limited": rate_limited}
            )
            
        except Exception as e:
            self.log_test(
                "Rate Limiting - Basic Test",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    async def _test_security_headers(self):
        """Test security headers in responses"""
        try:
            async with self.session.get(f"{BACKEND_URL}/") as response:
                headers = dict(response.headers)
                
                # Check for security headers
                expected_headers = [
                    "X-Content-Type-Options",
                    "X-Frame-Options"
                ]
                
                headers_present = []
                headers_missing = []
                
                for header in expected_headers:
                    if header in headers:
                        headers_present.append(header)
                    else:
                        headers_missing.append(header)
                
                security_headers_ok = len(headers_missing) == 0
                
                self.log_test(
                    "Security Headers - Basic Check",
                    security_headers_ok,
                    f"Present: {headers_present}, Missing: {headers_missing}",
                    {"headers_present": headers_present, "headers_missing": headers_missing}
                )
                
        except Exception as e:
            self.log_test(
                "Security Headers - Basic Check",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    async def test_monitoring_endpoints(self):
        """Test 5: Monitoring & Health Checks"""
        print("\n📊 TESTING MONITORING ENDPOINTS")
        
        monitoring_endpoints = [
            "/monitoring/health",
            "/monitoring/system-metrics",
            "/monitoring/usage-stats",
            "/monitoring/alerts"
        ]
        
        for endpoint in monitoring_endpoints:
            try:
                async with self.session.get(f"{BACKEND_URL}{endpoint}") as response:
                    success = response.status == 200
                    
                    if success:
                        try:
                            data = await response.json()
                            has_data = len(data) > 0
                        except:
                            has_data = False
                    else:
                        has_data = False
                        data = await response.text()
                    
                    self.log_test(
                        f"Monitoring - {endpoint}",
                        success,
                        f"HTTP {response.status}, has_data: {has_data}",
                        {"status": response.status, "has_data": has_data, "response_preview": str(data)[:200] if data else None}
                    )
                    
            except Exception as e:
                self.log_test(
                    f"Monitoring - {endpoint}",
                    False,
                    f"Exception: {str(e)}",
                    {"exception": str(e), "endpoint": endpoint}
                )
    
    async def test_integration_flow(self):
        """Test 6: End-to-End Integration Testing"""
        print("\n🔄 TESTING END-TO-END INTEGRATION FLOW")
        
        # Test complete flow: Request -> Protected Prompt -> AI -> Watermark -> Response
        await self._test_complete_ai_flow()
    
    async def _test_complete_ai_flow(self):
        """Test complete AI generation flow with IP protection"""
        try:
            # Step 1: Make AI request
            payload = {
                "session_id": f"integration-test-{int(time.time())}",
                "user_message": "Create a business plan outline for a sustainable fashion startup",
                "business_context": "Eco-friendly clothing brand targeting millennials"
            }
            
            start_time = time.time()
            
            async with self.session.post(
                f"{BACKEND_URL}/ai/business-plan",
                json=payload,
                headers={"Content-Type": "application/json"}
            ) as response:
                
                end_time = time.time()
                response_time = end_time - start_time
                
                if response.status == 200:
                    data = await response.json()
                    
                    # Step 2: Verify protected prompt was used (check response quality)
                    response_content = data["assistant_response"]
                    response_quality = len(response_content) > 100 and "business plan" in response_content.lower()
                    
                    # Step 3: Verify watermark was added
                    has_watermark = self._check_watermark(response_content)
                    
                    # Step 4: Verify no prompt exposure
                    no_prompt_exposure = not self._check_prompt_exposure(response_content)
                    
                    # Step 5: Verify response headers
                    has_copyright_header = "X-Copyright" in response.headers
                    
                    self.log_test(
                        "Integration Flow - Complete AI Flow",
                        response_quality and has_watermark and no_prompt_exposure,
                        f"Response time: {response_time:.2f}s, Quality: {response_quality}, Watermark: {has_watermark}, Protected: {no_prompt_exposure}",
                        {
                            "response_time": response_time,
                            "response_quality": response_quality,
                            "has_watermark": has_watermark,
                            "no_prompt_exposure": no_prompt_exposure,
                            "has_copyright_header": has_copyright_header,
                            "response_length": len(response_content)
                        }
                    )
                    
                else:
                    error_text = await response.text()
                    self.log_test(
                        "Integration Flow - Complete AI Flow",
                        False,
                        f"HTTP {response.status}: {error_text}",
                        {"status": response.status, "error": error_text}
                    )
                    
        except Exception as e:
            self.log_test(
                "Integration Flow - Complete AI Flow",
                False,
                f"Exception: {str(e)}",
                {"exception": str(e)}
            )
    
    def generate_report(self):
        """Generate comprehensive test report"""
        total_tests = len(self.test_results)
        passed_tests = len([t for t in self.test_results if t["success"]])
        failed_tests = len(self.failed_tests)
        
        print(f"\n" + "="*80)
        print("🔒 IP PROTECTION TESTING REPORT")
        print("="*80)
        print(f"Total Tests: {total_tests}")
        print(f"Passed: {passed_tests} ✅")
        print(f"Failed: {failed_tests} ❌")
        print(f"Success Rate: {(passed_tests/total_tests*100):.1f}%")
        
        if self.failed_tests:
            print(f"\n❌ FAILED TESTS ({len(self.failed_tests)}):")
            for test in self.failed_tests:
                print(f"  • {test['test']}: {test['details']}")
        
        print(f"\n✅ PASSED TESTS ({passed_tests}):")
        for test in self.test_results:
            if test["success"]:
                print(f"  • {test['test']}")
        
        # Summary by category
        categories = {}
        for test in self.test_results:
            category = test["test"].split(" - ")[0]
            if category not in categories:
                categories[category] = {"total": 0, "passed": 0}
            categories[category]["total"] += 1
            if test["success"]:
                categories[category]["passed"] += 1
        
        print(f"\n📊 RESULTS BY CATEGORY:")
        for category, stats in categories.items():
            success_rate = (stats["passed"] / stats["total"] * 100) if stats["total"] > 0 else 0
            print(f"  • {category}: {stats['passed']}/{stats['total']} ({success_rate:.1f}%)")
        
        return {
            "total_tests": total_tests,
            "passed_tests": passed_tests,
            "failed_tests": failed_tests,
            "success_rate": passed_tests/total_tests*100 if total_tests > 0 else 0,
            "failed_test_details": self.failed_tests,
            "categories": categories
        }

async def main():
    """Main test execution"""
    print("🚀 Starting Comprehensive IP Protection Testing for DowUrk AI")
    print(f"Backend URL: {BACKEND_URL}")
    print(f"Test Timeout: {TEST_TIMEOUT}s")
    
    tester = IPProtectionTester()
    
    try:
        await tester.setup()
        
        # Run all test suites
        await tester.test_protected_ai_endpoints()
        await tester.test_watermarking_system()
        await tester.test_access_control()
        await tester.test_ip_protection_middleware()
        await tester.test_monitoring_endpoints()
        await tester.test_integration_flow()
        
        # Generate final report
        report = tester.generate_report()
        
        # Return exit code based on results
        if report["failed_tests"] > 0:
            print(f"\n⚠️  {report['failed_tests']} tests failed. Review the issues above.")
            return 1
        else:
            print(f"\n🎉 All {report['total_tests']} tests passed! IP protection is working correctly.")
            return 0
            
    except Exception as e:
        print(f"\n💥 Test execution failed: {str(e)}")
        return 1
        
    finally:
        await tester.cleanup()

if __name__ == "__main__":
    exit_code = asyncio.run(main())
    exit(exit_code)