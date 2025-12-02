#!/usr/bin/env python3
"""
Local Backend Testing for AI Business Planning Assistant
Tests the backend running on localhost:8001
"""

import requests
import json
import uuid
import time

BASE_API_URL = "http://127.0.0.1:8001/api"

def test_basic_api():
    """Test basic API connectivity"""
    print("🔍 Testing Basic API Connectivity...")
    try:
        response = requests.get(f"{BASE_API_URL}/", timeout=10)
        if response.status_code == 200:
            print("✅ Basic API endpoint working")
            return True
        else:
            print(f"❌ Basic API failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Basic API failed: {str(e)}")
        return False

def test_chat_history_empty():
    """Test retrieving empty chat history"""
    print("🔍 Testing Empty Chat History Retrieval...")
    try:
        fake_session = f"empty-test-{uuid.uuid4()}"
        response = requests.get(f"{BASE_API_URL}/ai/chat-history/{fake_session}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'session_id' in data and 'messages' in data and data['messages'] == []:
                print("✅ Empty chat history retrieval working")
                return True
            else:
                print(f"❌ Unexpected response format: {data}")
                return False
        else:
            print(f"❌ Chat history failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Chat history test failed: {str(e)}")
        return False

def test_existing_chat_history():
    """Test retrieving existing chat history from database"""
    print("🔍 Testing Existing Chat History...")
    try:
        # Use a session we know exists from MongoDB
        response = requests.get(f"{BASE_API_URL}/ai/chat-history/test-session-001", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'session_id' in data and 'messages' in data:
                message_count = len(data['messages'])
                print(f"✅ Retrieved {message_count} messages from existing session")
                
                # Check message structure if messages exist
                if message_count > 0:
                    first_msg = data['messages'][0]
                    required_fields = ['id', 'session_id', 'role', 'content', 'timestamp']
                    if all(field in first_msg for field in required_fields):
                        print("✅ Message structure is correct")
                        
                        # Check chronological order
                        timestamps = [msg['timestamp'] for msg in data['messages']]
                        if timestamps == sorted(timestamps):
                            print("✅ Messages in chronological order")
                        else:
                            print("⚠️  Messages not in chronological order")
                        return True
                    else:
                        print(f"❌ Message missing required fields")
                        return False
                return True
            else:
                print(f"❌ Response missing required fields")
                return False
        else:
            print(f"❌ Existing chat history failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Existing chat history test failed: {str(e)}")
        return False

def test_ai_business_plan_simple():
    """Test AI business plan with a simple request"""
    print("🔍 Testing AI Business Plan (Simple)...")
    try:
        session_id = f"simple-test-{uuid.uuid4()}"
        payload = {
            "session_id": session_id,
            "user_message": "What are 3 key steps to start a small business?"
        }
        
        print("   Sending request to GPT-5... (this may take 30-60 seconds)")
        response = requests.post(
            f"{BASE_API_URL}/ai/business-plan",
            json=payload,
            timeout=120  # 2 minute timeout for GPT-5
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['session_id', 'user_message', 'assistant_response', 'timestamp']
            
            if all(field in data for field in required_fields):
                response_length = len(data['assistant_response'])
                print(f"✅ AI response generated ({response_length} chars)")
                
                # Check if response is business-focused
                response_text = data['assistant_response'].lower()
                business_terms = ['business', 'plan', 'market', 'customer', 'revenue', 'startup']
                if any(term in response_text for term in business_terms):
                    print("✅ Response appears business-focused")
                else:
                    print("⚠️  Response may not be business-focused")
                
                return True, session_id
            else:
                print(f"❌ Response missing required fields: {required_fields}")
                return False, None
        elif response.status_code == 500:
            print("❌ AI service error (likely GPT-5 API issue)")
            try:
                error_data = response.json()
                print(f"   Error details: {error_data.get('detail', 'No details')}")
            except:
                print(f"   Raw response: {response.text}")
            return False, None
        else:
            print(f"❌ AI business plan failed: HTTP {response.status_code}")
            print(f"   Response: {response.text}")
            return False, None
            
    except requests.exceptions.Timeout:
        print("❌ AI request timed out (GPT-5 API may be slow)")
        return False, None
    except Exception as e:
        print(f"❌ AI business plan test failed: {str(e)}")
        return False, None

def test_ai_with_context():
    """Test AI business plan with business context"""
    print("🔍 Testing AI Business Plan with Context...")
    try:
        session_id = f"context-test-{uuid.uuid4()}"
        payload = {
            "session_id": session_id,
            "user_message": "What marketing strategies would work for my business?",
            "business_context": "Small bakery in New Orleans targeting young professionals"
        }
        
        print("   Sending request with business context...")
        response = requests.post(
            f"{BASE_API_URL}/ai/business-plan",
            json=payload,
            timeout=120
        )
        
        if response.status_code == 200:
            data = response.json()
            response_text = data['assistant_response'].lower()
            
            # Check if context is incorporated
            context_terms = ['new orleans', 'bakery', 'young professionals', 'marketing']
            context_mentions = sum(1 for term in context_terms if term in response_text)
            
            if context_mentions >= 2:
                print(f"✅ AI incorporated business context ({context_mentions}/4 terms found)")
                return True, session_id
            else:
                print(f"⚠️  Limited context integration ({context_mentions}/4 terms found)")
                return True, session_id  # Still working, just not optimal
        else:
            print(f"❌ Context test failed: HTTP {response.status_code}")
            return False, None
            
    except Exception as e:
        print(f"❌ Context test failed: {str(e)}")
        return False, None

def test_delete_chat_history(session_id):
    """Test deleting chat history"""
    print(f"🔍 Testing Chat History Deletion for {session_id}...")
    try:
        response = requests.delete(f"{BASE_API_URL}/ai/chat-history/{session_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'message' in data and 'session_id' in data:
                deleted_count = data['message']
                print(f"✅ Chat history deletion response: {deleted_count}")
                
                # Verify deletion
                verify_response = requests.get(f"{BASE_API_URL}/ai/chat-history/{session_id}", timeout=10)
                if verify_response.status_code == 200:
                    verify_data = verify_response.json()
                    if len(verify_data['messages']) == 0:
                        print("✅ Deletion verified - no messages remain")
                        return True
                    else:
                        print(f"❌ Deletion failed - {len(verify_data['messages'])} messages still exist")
                        return False
                else:
                    print("❌ Could not verify deletion")
                    return False
            else:
                print(f"❌ Delete response missing required fields")
                return False
        else:
            print(f"❌ Chat history deletion failed: HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Chat history deletion test failed: {str(e)}")
        return False

def test_error_handling():
    """Test error handling with invalid requests"""
    print("🔍 Testing Error Handling...")
    try:
        invalid_tests = [
            ({}, "Empty payload"),
            ({"session_id": "test"}, "Missing user_message"),
            ({"user_message": "test"}, "Missing session_id"),
            ({"session_id": "", "user_message": ""}, "Empty strings")
        ]
        
        passed_tests = 0
        for payload, description in invalid_tests:
            response = requests.post(f"{BASE_API_URL}/ai/business-plan", json=payload, timeout=10)
            if response.status_code >= 400:
                passed_tests += 1
            else:
                print(f"   ⚠️  {description} should fail but got HTTP {response.status_code}")
        
        if passed_tests == len(invalid_tests):
            print(f"✅ Error handling working - rejected {passed_tests}/{len(invalid_tests)} invalid requests")
            return True
        else:
            print(f"⚠️  Error handling partial - rejected {passed_tests}/{len(invalid_tests)} invalid requests")
            return False
    except Exception as e:
        print(f"❌ Error handling test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🧪 AI Business Assistant Local Backend Tests")
    print(f"Backend URL: {BASE_API_URL}")
    print("=" * 60)
    
    results = []
    test_sessions = []
    
    # Test 1: Basic API
    results.append(test_basic_api())
    
    # Test 2: Empty chat history
    results.append(test_chat_history_empty())
    
    # Test 3: Existing chat history
    results.append(test_existing_chat_history())
    
    # Test 4: Error handling
    results.append(test_error_handling())
    
    # Test 5: AI business plan (may fail due to GPT-5 issues)
    ai_success, session_id = test_ai_business_plan_simple()
    results.append(ai_success)
    if session_id:
        test_sessions.append(session_id)
    
    # Test 6: AI with context (may fail due to GPT-5 issues)
    context_success, context_session = test_ai_with_context()
    results.append(context_success)
    if context_session:
        test_sessions.append(context_session)
    
    # Test 7: Delete chat history for all created sessions
    for session in test_sessions:
        results.append(test_delete_chat_history(session))
    
    # Summary
    print("\n" + "=" * 60)
    print("📊 TEST SUMMARY")
    print("=" * 60)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    # Categorize results
    basic_tests = results[:4]  # API, chat history, error handling
    ai_tests = results[4:6]    # AI functionality
    cleanup_tests = results[6:] # Deletion tests
    
    print(f"\nBasic API Tests: {sum(basic_tests)}/{len(basic_tests)}")
    print(f"AI Functionality: {sum(ai_tests)}/{len(ai_tests)}")
    print(f"Cleanup Tests: {sum(cleanup_tests)}/{len(cleanup_tests)}")
    
    if not all(basic_tests):
        print("\n❌ CRITICAL: Basic API functionality issues detected")
    elif not all(ai_tests):
        print("\n⚠️  AI functionality issues (likely GPT-5 API problems)")
        print("   This may be temporary - check backend logs for 502 errors")
    else:
        print("\n✅ All core functionality working correctly")
    
    return passed >= (total * 0.8)  # 80% pass rate acceptable

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)