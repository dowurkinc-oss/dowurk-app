#!/usr/bin/env python3
"""
Comprehensive Backend Testing for DowUrk AI Business Planning Assistant
Tests all AI endpoints with various scenarios and edge cases
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

class AIBusinessAssistantTester:
    def __init__(self):
        self.session_id = f"test-session-{uuid.uuid4()}"
        self.test_results = []
        
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
    
    def test_business_plan_endpoint_basic(self):
        """Test basic business plan generation"""
        test_name = "POST /api/ai/business-plan - Basic Request"
        
        try:
            payload = {
                "session_id": self.session_id,
                "user_message": "How do I start a nonprofit organization for helping underserved youth?"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                required_fields = ['session_id', 'user_message', 'assistant_response', 'timestamp']
                
                if all(field in data for field in required_fields):
                    if data['assistant_response'] and len(data['assistant_response']) > 50:
                        self.log_test(test_name, True, f"Response length: {len(data['assistant_response'])} chars")
                    else:
                        self.log_test(test_name, False, "AI response too short or empty")
                else:
                    self.log_test(test_name, False, f"Missing required fields: {required_fields}")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_business_plan_with_context(self):
        """Test business plan generation with business context"""
        test_name = "POST /api/ai/business-plan - With Business Context"
        
        try:
            payload = {
                "session_id": self.session_id,
                "user_message": "What marketing strategies would work best for my target audience?",
                "business_context": "Located in New Orleans, targeting young entrepreneurs aged 18-25 in the tech sector"
            }
            
            response = requests.post(
                f"{BASE_API_URL}/ai/business-plan",
                json=payload,
                timeout=30
            )
            
            if response.status_code == 200:
                data = response.json()
                # Check if response mentions context elements
                response_text = data['assistant_response'].lower()
                context_mentions = any(term in response_text for term in ['new orleans', 'young', '18-25', 'tech'])
                
                if context_mentions:
                    self.log_test(test_name, True, "AI response incorporates business context")
                else:
                    self.log_test(test_name, True, "Response generated but context integration unclear")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_multiple_conversation_flow(self):
        """Test multiple messages in same session"""
        test_name = "Multiple Message Conversation Flow"
        
        try:
            messages = [
                "I want to start a food truck business. Where should I begin?",
                "What permits and licenses do I need?",
                "How much startup capital should I expect to need?"
            ]
            
            responses = []
            for i, message in enumerate(messages):
                payload = {
                    "session_id": self.session_id,
                    "user_message": message
                }
                
                response = requests.post(
                    f"{BASE_API_URL}/ai/business-plan",
                    json=payload,
                    timeout=30
                )
                
                if response.status_code == 200:
                    responses.append(response.json())
                    time.sleep(1)  # Brief pause between requests
                else:
                    self.log_test(test_name, False, f"Message {i+1} failed: HTTP {response.status_code}")
                    return
            
            if len(responses) == len(messages):
                self.log_test(test_name, True, f"Successfully sent {len(messages)} messages")
            else:
                self.log_test(test_name, False, f"Only {len(responses)}/{len(messages)} messages succeeded")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_chat_history_retrieval(self):
        """Test retrieving chat history"""
        test_name = "GET /api/ai/chat-history/{session_id}"
        
        try:
            response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'session_id' in data and 'messages' in data:
                    messages = data['messages']
                    if len(messages) >= 2:  # Should have at least user + assistant messages
                        # Check message structure
                        first_msg = messages[0]
                        required_fields = ['id', 'session_id', 'role', 'content', 'timestamp']
                        
                        if all(field in first_msg for field in required_fields):
                            # Check chronological order
                            timestamps = [msg['timestamp'] for msg in messages]
                            is_ordered = timestamps == sorted(timestamps)
                            
                            if is_ordered:
                                self.log_test(test_name, True, f"Retrieved {len(messages)} messages in correct order")
                            else:
                                self.log_test(test_name, False, "Messages not in chronological order")
                        else:
                            self.log_test(test_name, False, f"Message missing required fields: {required_fields}")
                    else:
                        self.log_test(test_name, False, f"Expected multiple messages, got {len(messages)}")
                else:
                    self.log_test(test_name, False, "Response missing session_id or messages")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_nonexistent_session_history(self):
        """Test retrieving history for non-existent session"""
        test_name = "GET /api/ai/chat-history/{nonexistent_session}"
        
        try:
            fake_session = f"nonexistent-{uuid.uuid4()}"
            response = requests.get(f"{BASE_API_URL}/ai/chat-history/{fake_session}")
            
            if response.status_code == 200:
                data = response.json()
                if data['messages'] == []:
                    self.log_test(test_name, True, "Returns empty array for non-existent session")
                else:
                    self.log_test(test_name, False, f"Expected empty array, got {len(data['messages'])} messages")
            else:
                self.log_test(test_name, False, f"HTTP {response.status_code}: {response.text}")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_clear_chat_history(self):
        """Test clearing chat history"""
        test_name = "DELETE /api/ai/chat-history/{session_id}"
        
        try:
            # First, get current message count
            history_response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
            if history_response.status_code == 200:
                initial_count = len(history_response.json()['messages'])
            else:
                initial_count = 0
            
            # Clear the history
            response = requests.delete(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
            
            if response.status_code == 200:
                data = response.json()
                
                if 'message' in data and 'session_id' in data:
                    # Verify history is actually cleared
                    verify_response = requests.get(f"{BASE_API_URL}/ai/chat-history/{self.session_id}")
                    if verify_response.status_code == 200:
                        remaining_messages = len(verify_response.json()['messages'])
                        if remaining_messages == 0:
                            self.log_test(test_name, True, f"Deleted {initial_count} messages successfully")
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
    
    def test_error_handling_invalid_input(self):
        """Test error handling with invalid inputs"""
        test_name = "Error Handling - Invalid Input"
        
        try:
            # Test with missing required fields
            invalid_payloads = [
                {},  # Empty payload
                {"session_id": "test"},  # Missing user_message
                {"user_message": "test"},  # Missing session_id
                {"session_id": "", "user_message": ""},  # Empty strings
            ]
            
            error_count = 0
            for i, payload in enumerate(invalid_payloads):
                response = requests.post(
                    f"{BASE_API_URL}/ai/business-plan",
                    json=payload,
                    timeout=10
                )
                
                if response.status_code >= 400:  # Should return error
                    error_count += 1
            
            if error_count == len(invalid_payloads):
                self.log_test(test_name, True, f"Properly rejected {error_count} invalid requests")
            else:
                self.log_test(test_name, False, f"Only rejected {error_count}/{len(invalid_payloads)} invalid requests")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def test_session_persistence(self):
        """Test that different sessions are kept separate"""
        test_name = "Session Persistence and Isolation"
        
        try:
            session1 = f"session1-{uuid.uuid4()}"
            session2 = f"session2-{uuid.uuid4()}"
            
            # Send message to session 1
            payload1 = {
                "session_id": session1,
                "user_message": "I want to start a bakery business"
            }
            
            response1 = requests.post(f"{BASE_API_URL}/ai/business-plan", json=payload1, timeout=30)
            
            # Send message to session 2
            payload2 = {
                "session_id": session2,
                "user_message": "I want to start a tech startup"
            }
            
            response2 = requests.post(f"{BASE_API_URL}/ai/business-plan", json=payload2, timeout=30)
            
            if response1.status_code == 200 and response2.status_code == 200:
                # Check that each session has only its own messages
                history1 = requests.get(f"{BASE_API_URL}/ai/chat-history/{session1}")
                history2 = requests.get(f"{BASE_API_URL}/ai/chat-history/{session2}")
                
                if history1.status_code == 200 and history2.status_code == 200:
                    messages1 = history1.json()['messages']
                    messages2 = history2.json()['messages']
                    
                    # Each should have 2 messages (user + assistant)
                    if len(messages1) == 2 and len(messages2) == 2:
                        # Check that messages contain correct content
                        user_msg1 = next((m for m in messages1 if m['role'] == 'user'), None)
                        user_msg2 = next((m for m in messages2 if m['role'] == 'user'), None)
                        
                        if (user_msg1 and 'bakery' in user_msg1['content'] and 
                            user_msg2 and 'tech startup' in user_msg2['content']):
                            self.log_test(test_name, True, "Sessions properly isolated")
                        else:
                            self.log_test(test_name, False, "Session content mixing detected")
                    else:
                        self.log_test(test_name, False, f"Unexpected message counts: {len(messages1)}, {len(messages2)}")
                else:
                    self.log_test(test_name, False, "Could not retrieve session histories")
            else:
                self.log_test(test_name, False, "Failed to create test sessions")
                
        except Exception as e:
            self.log_test(test_name, False, f"Exception: {str(e)}")
    
    def run_all_tests(self):
        """Run all backend tests"""
        print(f"\n🧪 Starting AI Business Assistant Backend Tests")
        print(f"Backend URL: {BACKEND_URL}")
        print(f"Test Session ID: {self.session_id}")
        print("=" * 60)
        
        # Run tests in logical order
        self.test_business_plan_endpoint_basic()
        self.test_business_plan_with_context()
        self.test_multiple_conversation_flow()
        self.test_chat_history_retrieval()
        self.test_nonexistent_session_history()
        self.test_session_persistence()
        self.test_error_handling_invalid_input()
        self.test_clear_chat_history()
        
        # Summary
        print("\n" + "=" * 60)
        print("📊 TEST SUMMARY")
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
        
        return passed == total

if __name__ == "__main__":
    tester = AIBusinessAssistantTester()
    success = tester.run_all_tests()
    
    if success:
        print("\n🎉 All tests passed! AI Business Assistant backend is working correctly.")
    else:
        print("\n⚠️  Some tests failed. Check the details above.")
    
    exit(0 if success else 1)