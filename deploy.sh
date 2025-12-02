#!/bin/bash
# DowUrk AI - Heroku Deployment Script
# Run this after setting up Heroku apps

set -e  # Exit on error

echo "🚀 DowUrk AI - Heroku Deployment"
echo "================================"
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Heroku CLI is installed
if ! command -v heroku &> /dev/null; then
    echo "${RED}❌ Heroku CLI not installed${NC}"
    echo "Install from: https://devcenter.heroku.com/articles/heroku-cli"
    exit 1
fi

echo "${GREEN}✅ Heroku CLI found${NC}"
echo ""

# Ask for app names
echo "${YELLOW}Enter your Heroku app names:${NC}"
read -p "Backend app name (e.g., dowurk-api): " BACKEND_APP
read -p "Frontend app name (e.g., dowurk-app): " FRONTEND_APP

echo ""
echo "${YELLOW}Apps to deploy:${NC}"
echo "  Backend: $BACKEND_APP"
echo "  Frontend: $FRONTEND_APP"
echo ""
read -p "Continue? (y/n): " -n 1 -r
echo ""

if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo "Deployment cancelled"
    exit 1
fi

# Deploy Backend
echo ""
echo "${GREEN}===== DEPLOYING BACKEND =====${NC}"
echo ""

cd /app/backend

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial backend deployment"
fi

# Add Heroku remote if doesn't exist
if ! git remote | grep -q "heroku"; then
    echo "Adding Heroku remote..."
    heroku git:remote -a $BACKEND_APP
fi

echo "Deploying backend to Heroku..."
git push heroku main || git push heroku master

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Backend deployed successfully!${NC}"
else
    echo "${RED}❌ Backend deployment failed${NC}"
    exit 1
fi

# Deploy Frontend
echo ""
echo "${GREEN}===== DEPLOYING FRONTEND =====${NC}"
echo ""

cd /app/frontend

# Check if git repo exists
if [ ! -d ".git" ]; then
    echo "Initializing git repository..."
    git init
    git add .
    git commit -m "Initial frontend deployment"
fi

# Add Heroku remote if doesn't exist
if ! git remote | grep -q "heroku"; then
    echo "Adding Heroku remote..."
    heroku git:remote -a $FRONTEND_APP
fi

echo "Deploying frontend to Heroku..."
git push heroku main || git push heroku master

if [ $? -eq 0 ]; then
    echo "${GREEN}✅ Frontend deployed successfully!${NC}"
else
    echo "${RED}❌ Frontend deployment failed${NC}"
    exit 1
fi

# Summary
echo ""
echo "${GREEN}===== DEPLOYMENT COMPLETE =====${NC}"
echo ""
echo "Your apps are live at:"
echo "  Backend:  https://$BACKEND_APP.herokuapp.com"
echo "  Frontend: https://$FRONTEND_APP.herokuapp.com"
echo ""
echo "Next steps:"
echo "  1. Test backend: curl https://$BACKEND_APP.herokuapp.com/api/monitoring/health"
echo "  2. Test frontend: Open https://$FRONTEND_APP.herokuapp.com in browser"
echo "  3. Check logs: heroku logs --tail --app $BACKEND_APP"
echo "  4. Set up custom domain (see DOMAIN_RECOMMENDATIONS.md)"
echo ""
echo "🎉 Deployment successful!"
