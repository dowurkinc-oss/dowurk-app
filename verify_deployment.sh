#!/bin/bash
# DowUrk AI - Deployment Verification Script
# Run this after deployment to verify everything works

set -e

echo "🔍 DowUrk AI - Deployment Verification"
echo "====================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Get backend URL
read -p "Enter your backend URL (e.g., https://dowurk-api.herokuapp.com): " BACKEND_URL
read -p "Enter your frontend URL (e.g., https://dowurk-app.herokuapp.com): " FRONTEND_URL

echo ""
echo "Testing: $BACKEND_URL"
echo ""

# Test 1: Health Check
echo "${YELLOW}Test 1: Health Check${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/monitoring/health")
if [ "$STATUS" -eq 200 ]; then
    HEALTH=$(curl -s "$BACKEND_URL/api/monitoring/health" | python3 -c "import sys, json; print(json.load(sys.stdin)['status'])" 2>/dev/null || echo "error")
    if [ "$HEALTH" = "healthy" ]; then
        echo "${GREEN}✅ PASS - Backend is healthy${NC}"
    else
        echo "${RED}❌ FAIL - Backend unhealthy: $HEALTH${NC}"
    fi
else
    echo "${RED}❌ FAIL - Health check returned $STATUS${NC}"
fi
echo ""

# Test 2: System Metrics
echo "${YELLOW}Test 2: System Metrics${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/monitoring/system-metrics")
if [ "$STATUS" -eq 200 ]; then
    echo "${GREEN}✅ PASS - System metrics accessible${NC}"
else
    echo "${RED}❌ FAIL - System metrics returned $STATUS${NC}"
fi
echo ""

# Test 3: Payment Packages
echo "${YELLOW}Test 3: Payment Packages${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/payments/packages")
if [ "$STATUS" -eq 200 ]; then
    PACKAGES=$(curl -s "$BACKEND_URL/api/payments/packages" | python3 -c "import sys, json; print(len(json.load(sys.stdin)['packages']))" 2>/dev/null || echo "0")
    if [ "$PACKAGES" -eq 4 ]; then
        echo "${GREEN}✅ PASS - All 4 subscription packages available${NC}"
    else
        echo "${RED}❌ FAIL - Expected 4 packages, got $PACKAGES${NC}"
    fi
else
    echo "${RED}❌ FAIL - Payment packages returned $STATUS${NC}"
fi
echo ""

# Test 4: IP Protection (Protected Document)
echo "${YELLOW}Test 4: IP Protection${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/docs/FUNDRAISING_STRATEGY.md")
if [ "$STATUS" -eq 403 ]; then
    echo "${GREEN}✅ PASS - Protected documents blocked${NC}"
else
    echo "${RED}❌ FAIL - Protected documents not blocked (got $STATUS)${NC}"
fi
echo ""

# Test 5: Frontend
echo "${YELLOW}Test 5: Frontend${NC}"
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$STATUS" -eq 200 ]; then
    echo "${GREEN}✅ PASS - Frontend is accessible${NC}"
else
    echo "${RED}❌ FAIL - Frontend returned $STATUS${NC}"
fi
echo ""

# Test 6: CORS (Basic check)
echo "${YELLOW}Test 6: CORS Configuration${NC}"
CORS_HEADER=$(curl -s -I "$BACKEND_URL/api/monitoring/health" | grep -i "access-control-allow-origin" || echo "")
if [ ! -z "$CORS_HEADER" ]; then
    echo "${GREEN}✅ PASS - CORS headers present${NC}"
else
    echo "${YELLOW}⚠️  WARNING - CORS headers not detected (may need configuration)${NC}"
fi
echo ""

# Test 7: SSL/HTTPS
echo "${YELLOW}Test 7: SSL/HTTPS${NC}"
if [[ $BACKEND_URL == https://* ]]; then
    SSL_STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/monitoring/health")
    if [ "$SSL_STATUS" -eq 200 ]; then
        echo "${GREEN}✅ PASS - SSL certificate valid${NC}"
    else
        echo "${RED}❌ FAIL - SSL issue detected${NC}"
    fi
else
    echo "${RED}❌ FAIL - Not using HTTPS${NC}"
fi
echo ""

# Summary
echo "${GREEN}===== VERIFICATION COMPLETE =====${NC}"
echo ""
echo "Your deployment URLs:"
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
echo ""
echo "Manual tests to perform:"
echo "  1. Open $FRONTEND_URL in browser"
echo "  2. Try registering a new user"
echo "  3. Test AI business planning feature"
echo "  4. Test payment flow (use test card: 4242 4242 4242 4242)"
echo "  5. Verify all pages load correctly"
echo ""
echo "🎉 Automated verification complete!"
