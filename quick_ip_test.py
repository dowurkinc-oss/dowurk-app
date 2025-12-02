#!/usr/bin/env python3
"""
Quick IP Protection Test - Focused Testing
"""

import requests
import json
import time

BACKEND_URL = "https://ai-workforce-20.preview.emergentagent.com/api"

def test_ai_endpoints():
    """Test AI endpoints for watermarks and protection"""
    print("🔒 Testing AI Endpoints...")
    
    # Test Business Planning
    try:
        response = requests.post(f"{BACKEND_URL}/ai/business-plan", 
            json={
                "session_id": f"test-{int(time.time())}",
                "user_message": "What are key business plan components?",
                "business_context": "Tech startup"
            }, timeout=60)
        
        if response.status_code == 200:
            data = response.json()
            content = data["assistant_response"]
            has_watermark = "\u200B" in content
            print(f"✅ Business Planning API: Working, Watermark: {has_watermark}")
            print(f"   Response length: {len(content)} chars")
        else:
            print(f"❌ Business Planning API: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Business Planning API: {str(e)}")
    
    # Test Content Generator
    try:
        response = requests.post(f"{BACKEND_URL}/ai/content-generator",
            json={
                "content_type": "tagline",
                "topic": "AI business platform",
                "tone": "professional",
                "length": "short"
            }, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            content = data["generated_content"]
            has_watermark = "\u200B" in content
            print(f"✅ Content Generator API: Working, Watermark: {has_watermark}")
            print(f"   Generated: {content[:50]}...")
        else:
            print(f"❌ Content Generator API: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Content Generator API: {str(e)}")

def test_document_protection():
    """Test document protection middleware"""
    print("\n🛡️ Testing Document Protection...")
    
    # Test protected documents
    protected_docs = ["FUNDRAISING_STRATEGY.md", "COMPETITIVE_ANALYSIS_FRAMEWORK.md", "PRODUCTION_READY_GUIDE.md"]
    
    for doc in protected_docs:
        try:
            response = requests.get(f"{BACKEND_URL}/docs/{doc}", timeout=10)
            blocked = response.status_code == 403
            print(f"{'✅' if blocked else '❌'} {doc}: {'Blocked (403)' if blocked else f'Accessible ({response.status_code})'}")
        except Exception as e:
            print(f"❌ {doc}: {str(e)}")
    
    # Test public document
    try:
        response = requests.get(f"{BACKEND_URL}/docs/METRICS_DASHBOARD_GUIDE.md", timeout=10)
        accessible = response.status_code == 200
        print(f"{'✅' if accessible else '❌'} METRICS_DASHBOARD_GUIDE.md (Public): {'Accessible (200)' if accessible else f'Blocked ({response.status_code})'}")
    except Exception as e:
        print(f"❌ METRICS_DASHBOARD_GUIDE.md: {str(e)}")

def test_monitoring_endpoints():
    """Test monitoring endpoints"""
    print("\n📊 Testing Monitoring Endpoints...")
    
    endpoints = ["/monitoring/health", "/monitoring/system-metrics", "/monitoring/usage-stats", "/monitoring/alerts"]
    
    for endpoint in endpoints:
        try:
            response = requests.get(f"{BACKEND_URL}{endpoint}", timeout=15)
            working = response.status_code == 200
            print(f"{'✅' if working else '❌'} {endpoint}: {'Working (200)' if working else f'Failed ({response.status_code})'}")
        except Exception as e:
            print(f"❌ {endpoint}: {str(e)}")

def test_watermark_detection():
    """Test watermark detection"""
    print("\n🏷️ Testing Watermark System...")
    
    try:
        response = requests.post(f"{BACKEND_URL}/ai/content-generator",
            json={
                "content_type": "email",
                "topic": "Watermark test content",
                "tone": "friendly",
                "length": "medium"
            }, timeout=30)
        
        if response.status_code == 200:
            data = response.json()
            content = data["generated_content"]
            
            # Check for watermark pattern
            if "\u200B" in content:
                parts = content.split("\u200B")
                if len(parts) >= 3:
                    watermark_hash = parts[1]
                    print(f"✅ Watermark Detection: Found hash '{watermark_hash}'")
                    
                    # Test invisibility
                    visible_content = content.replace("\u200B", "")
                    print(f"✅ Watermark Invisibility: Content readable ({len(visible_content)} chars)")
                else:
                    print("❌ Watermark Detection: Pattern found but invalid format")
            else:
                print("❌ Watermark Detection: No watermark found")
        else:
            print(f"❌ Watermark Test: HTTP {response.status_code}")
    except Exception as e:
        print(f"❌ Watermark Test: {str(e)}")

def main():
    print("🚀 Quick IP Protection Testing for DowUrk AI")
    print(f"Backend URL: {BACKEND_URL}")
    print("="*60)
    
    test_ai_endpoints()
    test_document_protection()
    test_monitoring_endpoints()
    test_watermark_detection()
    
    print("\n" + "="*60)
    print("✅ IP Protection Testing Complete!")

if __name__ == "__main__":
    main()