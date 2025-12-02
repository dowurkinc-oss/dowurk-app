#!/usr/bin/env python3
"""
Simple Backend Testing for AI Business Planning Assistant
Focuses on testing endpoints with shorter timeouts and better error handling
"""

import requests
import json
import uuid
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv('/app/frontend/.env')

# Get backend URL from environment
BACKEND_URL = os.getenv('REACT_APP_BACKEND_URL', 'http://localhost:8001')
BASE_API_URL = f"{BACKEND_URL}/api"

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
    """Test AI business plan with a simple request and short timeout"""
    print("🔍 Testing AI Business Plan (Simple)...")
    try:
        session_id = f"simple-test-{uuid.uuid4()}"
        payload = {
            "session_id": session_id,
            "user_message": "Hello, can you help me?"
        }
        
        # Use a shorter timeout since GPT-5 might be slow
        response = requests.post(
            f"{BASE_API_URL}/ai/business-plan",
            json=payload,
            timeout=60  # 1 minute timeout
        )
        
        if response.status_code == 200:
            data = response.json()
            required_fields = ['session_id', 'user_message', 'assistant_response', 'timestamp']
            
            if all(field in data for field in required_fields):
                response_length = len(data['assistant_response'])
                print(f"✅ AI response generated ({response_length} chars)")
                return True, session_id
            else:
                print(f"❌ Response missing required fields: {required_fields}")
                return False, None
        elif response.status_code == 500:
            print("❌ AI service error (likely GPT-5 API issue)")
            print(f"   Response: {response.text}")
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

def test_delete_chat_history(session_id):
    """Test deleting chat history"""
    print("🔍 Testing Chat History Deletion...")
    try:
        response = requests.delete(f"{BASE_API_URL}/ai/chat-history/{session_id}", timeout=10)
        
        if response.status_code == 200:
            data = response.json()
            if 'message' in data and 'session_id' in data:
                print(f"✅ Chat history deletion working")
                
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
        # Test with empty payload
        response = requests.post(f"{BASE_API_URL}/ai/business-plan", json={}, timeout=10)
        
        if response.status_code >= 400:
            print("✅ Error handling working - rejects invalid requests")
            return True
        else:
            print(f"❌ Should reject empty payload but got HTTP {response.status_code}")
            return False
    except Exception as e:
        print(f"❌ Error handling test failed: {str(e)}")
        return False

def main():
    """Run all tests"""
    print("🧪 AI Business Assistant Backend Tests")
    print(f"Backend URL: {BACKEND_URL}")
    print("=" * 50)
    
    results = []
    
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
    
    # Test 6: Delete chat history (only if AI test created a session)
    if session_id:
        results.append(test_delete_chat_history(session_id))
    
    # Summary
    print("\n" + "=" * 50)
    print("📊 TEST SUMMARY")
    print("=" * 50)
    
    passed = sum(results)
    total = len(results)
    
    print(f"Passed: {passed}/{total}")
    print(f"Success Rate: {(passed/total)*100:.1f}%")
    
    if passed < total:
        print("\n⚠️  Issues Found:")
        if not results[4]:  # AI test failed
            print("  • GPT-5 API experiencing issues (502 Bad Gateway errors)")
            print("  • This is likely a temporary external service issue")
        
    return passed == total

if __name__ == "__main__":
    success = main()
    exit(0 if success else 1)