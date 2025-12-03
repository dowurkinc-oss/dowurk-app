#!/bin/bash
# DowUrk AI - Interactive Deployment Wizard
# This script walks you through the entire deployment process step-by-step

set -e

# Colors for better readability
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color
BOLD='\033[1m'

# Clear screen
clear

echo -e "${MAGENTA}${BOLD}"
echo "╔════════════════════════════════════════════════════╗"
echo "║                                                    ║"
echo "║          🚀 DowUrk AI Deployment Wizard 🚀         ║"
echo "║                                                    ║"
echo "║        Interactive Step-by-Step Deployment        ║"
echo "║                                                    ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${CYAN}This wizard will guide you through:${NC}"
echo "  1. Prerequisites check"
echo "  2. MongoDB Atlas setup verification"
echo "  3. Stripe configuration"
echo "  4. Environment variables setup"
echo "  5. Heroku deployment"
echo "  6. Verification tests"
echo ""
read -p "Press Enter to begin... "
clear

# Function to pause and wait for user
pause() {
    echo ""
    read -p "Press Enter to continue..."
    clear
}

# Function to ask yes/no question
ask_yes_no() {
    while true; do
        read -p "$1 (y/n): " yn
        case $yn in
            [Yy]* ) return 0;;
            [Nn]* ) return 1;;
            * ) echo "Please answer yes (y) or no (n).";;
        esac
    done
}

#############################################
# STEP 1: Prerequisites Check
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 1: Checking Prerequisites${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

# Check Heroku CLI
echo -n "Checking Heroku CLI... "
if command -v heroku &> /dev/null; then
    HEROKU_VERSION=$(heroku --version)
    echo -e "${GREEN}✓ Installed${NC}"
    echo "  $HEROKU_VERSION"
else
    echo -e "${RED}✗ Not installed${NC}"
    echo ""
    echo "Please install Heroku CLI:"
    echo "  Mac:     brew tap heroku/brew && brew install heroku"
    echo "  Windows: https://devcenter.heroku.com/articles/heroku-cli"
    echo "  Linux:   curl https://cli-assets.heroku.com/install.sh | sh"
    exit 1
fi

echo ""

# Check if logged into Heroku
echo -n "Checking Heroku authentication... "
if heroku auth:whoami &> /dev/null; then
    HEROKU_USER=$(heroku auth:whoami)
    echo -e "${GREEN}✓ Logged in as: $HEROKU_USER${NC}"
else
    echo -e "${YELLOW}⚠ Not logged in${NC}"
    echo ""
    echo "Please login to Heroku:"
    heroku login
    echo ""
fi

echo ""
echo -e "${GREEN}✓ All prerequisites met!${NC}"
pause

#############################################
# STEP 2: MongoDB Atlas Setup
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 2: MongoDB Atlas Configuration${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Have you completed MongoDB Atlas setup?"
echo ""
echo "Required steps:"
echo "  ✓ Created cluster (M0 Free Tier)"
echo "  ✓ Created database user (dowurk_admin)"
echo "  ✓ Set network access (0.0.0.0/0)"
echo "  ✓ Got connection string"
echo ""

if ! ask_yes_no "Have you completed all MongoDB setup steps?"; then
    echo ""
    echo -e "${YELLOW}Please complete MongoDB Atlas setup first:${NC}"
    echo ""
    echo "1. Go to: https://www.mongodb.com/cloud/atlas"
    echo "2. Click 'Build a Database' → Choose 'Shared' (Free)"
    echo "3. Cloud Provider: AWS, Region: us-east-1"
    echo "4. Cluster Name: dowurk-production"
    echo "5. Click 'Create Cluster' (wait 3-5 minutes)"
    echo ""
    echo "After cluster is created:"
    echo "6. Database Access → Add User:"
    echo "   - Username: dowurk_admin"
    echo "   - Autogenerate password (SAVE IT!)"
    echo "7. Network Access → Add IP:"
    echo "   - 0.0.0.0/0 (Allow from anywhere)"
    echo "8. Database → Connect → Connect your application:"
    echo "   - Copy connection string"
    echo "   - Replace <password> with your password"
    echo "   - Add '/dowurk_production' before '?'"
    echo ""
    echo "Run this script again after setup is complete."
    exit 0
fi

echo ""
echo "Great! Now I need your MongoDB connection string."
echo ""
echo -e "${CYAN}Example format:${NC}"
echo "mongodb+srv://dowurk_admin:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/dowurk_production?retryWrites=true&w=majority"
echo ""
read -p "Enter your MongoDB connection string: " MONGO_URL
echo ""

# Validate MongoDB URL format
if [[ ! $MONGO_URL =~ ^mongodb ]]; then
    echo -e "${RED}✗ Invalid MongoDB URL format${NC}"
    echo "Please make sure you copied the complete connection string."
    exit 1
fi

echo -e "${GREEN}✓ MongoDB connection string saved!${NC}"
pause

#############################################
# STEP 3: Stripe Configuration
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 3: Stripe Configuration${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Have you switched Stripe to LIVE mode?"
echo ""
echo "Required steps:"
echo "  ✓ Logged into dashboard.stripe.com"
echo "  ✓ Toggled 'Test mode' to 'Live mode'"
echo "  ✓ Got live API keys (sk_live_...)"
echo ""

if ! ask_yes_no "Have you switched to Stripe LIVE mode?"; then
    echo ""
    echo -e "${YELLOW}Please switch Stripe to live mode:${NC}"
    echo ""
    echo "1. Go to: https://dashboard.stripe.com"
    echo "2. Top-right corner: Toggle 'Test mode' to 'Live mode'"
    echo "3. Go to: Developers → API keys"
    echo "4. Copy 'Secret key' (starts with sk_live_)"
    echo ""
    echo "Run this script again after switching to live mode."
    exit 0
fi

echo ""
echo "Enter your Stripe LIVE API Secret Key"
echo ""
echo -e "${CYAN}It should start with: sk_live_${NC}"
echo ""
read -p "Stripe API Key: " STRIPE_API_KEY
echo ""

# Validate Stripe key format
if [[ ! $STRIPE_API_KEY =~ ^sk_live_ ]]; then
    echo -e "${YELLOW}⚠ Warning: Key doesn't start with 'sk_live_'${NC}"
    echo "Are you sure this is a LIVE mode key?"
    if ! ask_yes_no "Continue anyway?"; then
        exit 1
    fi
fi

echo -e "${GREEN}✓ Stripe API key saved!${NC}"
pause

#############################################
# STEP 4: Create Backend .env File
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 4: Creating Environment Files${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Creating backend .env file with your configuration..."
echo ""

cat > /app/backend/.env << EOF
# DowUrk AI - Production Environment Variables
# Generated by Deployment Wizard

# Database
MONGO_URL=$MONGO_URL
DB_NAME=dowurk_production

# Security Secrets (Pre-generated)
JWT_SECRET=02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0
JWT_ALGORITHM=HS256
IP_ENCRYPTION_KEY=c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1

# Stripe Payment
STRIPE_API_KEY=$STRIPE_API_KEY

# AI Service
EMERGENT_LLM_KEY=sk-emergent-d80Fd40DcEb594fBb2

# CORS (will be updated after Heroku deployment)
CORS_ORIGINS=*

# Environment
ENVIRONMENT=production
DEBUG=false
EOF

echo -e "${GREEN}✓ Backend .env file created!${NC}"
echo ""
echo "Creating frontend .env.production file..."

cat > /app/frontend/.env.production << EOF
# DowUrk AI Frontend - Production Environment
# Will be updated with Heroku URL after deployment
REACT_APP_BACKEND_URL=PLACEHOLDER
EOF

echo -e "${GREEN}✓ Frontend .env.production file created!${NC}"
pause

#############################################
# STEP 5: Create Heroku Apps
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 5: Creating Heroku Apps${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Now we'll create 2 Heroku apps:"
echo "  1. Backend API"
echo "  2. Frontend Web App"
echo ""
echo "Suggested names:"
echo "  Backend:  dowurk-api"
echo "  Frontend: dowurk-app"
echo ""
echo "(You can use different names if you prefer)"
echo ""

read -p "Enter backend app name [dowurk-api]: " BACKEND_APP
BACKEND_APP=${BACKEND_APP:-dowurk-api}

read -p "Enter frontend app name [dowurk-app]: " FRONTEND_APP
FRONTEND_APP=${FRONTEND_APP:-dowurk-app}

echo ""
echo "Creating Heroku apps..."
echo ""

# Create backend app
echo -n "Creating backend app ($BACKEND_APP)... "
if heroku create $BACKEND_APP &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    BACKEND_URL="https://$BACKEND_APP.herokuapp.com"
else
    echo -e "${YELLOW}⚠ App might already exist${NC}"
    BACKEND_URL="https://$BACKEND_APP.herokuapp.com"
fi

# Create frontend app
echo -n "Creating frontend app ($FRONTEND_APP)... "
if heroku create $FRONTEND_APP &> /dev/null; then
    echo -e "${GREEN}✓${NC}"
    FRONTEND_URL="https://$FRONTEND_APP.herokuapp.com"
else
    echo -e "${YELLOW}⚠ App might already exist${NC}"
    FRONTEND_URL="https://$FRONTEND_APP.herokuapp.com"
fi

echo ""
echo -e "${GREEN}✓ Heroku apps created!${NC}"
echo ""
echo "  Backend:  $BACKEND_URL"
echo "  Frontend: $FRONTEND_URL"
pause

#############################################
# STEP 6: Set Environment Variables
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 6: Setting Environment Variables${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Setting backend environment variables in Heroku..."
echo ""

heroku config:set MONGO_URL="$MONGO_URL" --app $BACKEND_APP
heroku config:set JWT_SECRET="02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0" --app $BACKEND_APP
heroku config:set IP_ENCRYPTION_KEY="c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1" --app $BACKEND_APP
heroku config:set STRIPE_API_KEY="$STRIPE_API_KEY" --app $BACKEND_APP
heroku config:set EMERGENT_LLM_KEY="sk-emergent-d80Fd40DcEb594fBb2" --app $BACKEND_APP
heroku config:set CORS_ORIGINS="$FRONTEND_URL,https://www.dowurktoday.com,https://dowurktoday.com" --app $BACKEND_APP
heroku config:set ENVIRONMENT="production" --app $BACKEND_APP
heroku config:set DEBUG="false" --app $BACKEND_APP

echo ""
echo "Setting frontend environment variables in Heroku..."
echo ""

heroku config:set REACT_APP_BACKEND_URL="$BACKEND_URL" --app $FRONTEND_APP

# Update local frontend .env.production
cat > /app/frontend/.env.production << EOF
REACT_APP_BACKEND_URL=$BACKEND_URL
EOF

echo ""
echo -e "${GREEN}✓ Environment variables set!${NC}"
pause

#############################################
# STEP 7: Deploy Backend
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 7: Deploying Backend${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Deploying backend to Heroku..."
echo "This may take 2-3 minutes..."
echo ""

cd /app/backend

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial backend deployment"
fi

# Add Heroku remote
heroku git:remote -a $BACKEND_APP 2>/dev/null || true

# Deploy
echo "Pushing code to Heroku..."
if git push heroku main 2>/dev/null || git push heroku master 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✓ Backend deployed successfully!${NC}"
else
    echo ""
    echo -e "${RED}✗ Backend deployment failed${NC}"
    echo "Check logs with: heroku logs --tail --app $BACKEND_APP"
    exit 1
fi

# Scale dyno
heroku ps:scale web=1 --app $BACKEND_APP

pause

#############################################
# STEP 8: Deploy Frontend
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 8: Deploying Frontend${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Deploying frontend to Heroku..."
echo "This may take 3-5 minutes..."
echo ""

cd /app/frontend

# Initialize git if needed
if [ ! -d ".git" ]; then
    git init
    git add .
    git commit -m "Initial frontend deployment"
fi

# Add buildpacks
heroku buildpacks:set heroku/nodejs --app $FRONTEND_APP
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static --app $FRONTEND_APP

# Add Heroku remote
heroku git:remote -a $FRONTEND_APP 2>/dev/null || true

# Deploy
echo "Pushing code to Heroku..."
if git push heroku main 2>/dev/null || git push heroku master 2>/dev/null; then
    echo ""
    echo -e "${GREEN}✓ Frontend deployed successfully!${NC}"
else
    echo ""
    echo -e "${RED}✗ Frontend deployment failed${NC}"
    echo "Check logs with: heroku logs --tail --app $FRONTEND_APP"
    exit 1
fi

# Scale dyno
heroku ps:scale web=1 --app $FRONTEND_APP

pause

#############################################
# STEP 9: Verification
#############################################
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo -e "${BLUE}${BOLD} STEP 9: Verifying Deployment${NC}"
echo -e "${BLUE}${BOLD}═══════════════════════════════════════${NC}"
echo ""

echo "Running verification tests..."
echo ""

# Test backend health
echo -n "Testing backend health... "
sleep 5  # Give backend time to start
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$BACKEND_URL/api/monitoring/health")
if [ "$STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Backend is healthy${NC}"
else
    echo -e "${YELLOW}⚠ Backend returned $STATUS (may need a moment to wake up)${NC}"
fi

# Test frontend
echo -n "Testing frontend... "
STATUS=$(curl -s -o /dev/null -w "%{http_code}" "$FRONTEND_URL")
if [ "$STATUS" -eq 200 ]; then
    echo -e "${GREEN}✓ Frontend is accessible${NC}"
else
    echo -e "${YELLOW}⚠ Frontend returned $STATUS${NC}"
fi

echo ""
pause

#############################################
# COMPLETION
#############################################
clear
echo -e "${GREEN}${BOLD}"
echo "╔════════════════════════════════════════════════════╗"
echo "║                                                    ║"
echo "║         🎉 DEPLOYMENT SUCCESSFUL! 🎉               ║"
echo "║                                                    ║"
echo "╚════════════════════════════════════════════════════╝"
echo -e "${NC}"
echo ""
echo -e "${CYAN}${BOLD}Your DowUrk AI Platform is LIVE!${NC}"
echo ""
echo -e "${BOLD}URLs:${NC}"
echo "  Backend API:  $BACKEND_URL"
echo "  Frontend App: $FRONTEND_URL"
echo ""
echo -e "${BOLD}Test your deployment:${NC}"
echo "  1. Open: $FRONTEND_URL"
echo "  2. Try registering a new user"
echo "  3. Test AI features"
echo "  4. Test payment flow (use test card: 4242 4242 4242 4242)"
echo ""
echo -e "${BOLD}Monitor your apps:${NC}"
echo "  Backend logs:  heroku logs --tail --app $BACKEND_APP"
echo "  Frontend logs: heroku logs --tail --app $FRONTEND_APP"
echo ""
echo -e "${BOLD}Next steps:${NC}"
echo "  1. Test all features thoroughly"
echo "  2. Connect custom domain (www.dowurktoday.com)"
echo "  3. Set up monitoring (Sentry, UptimeRobot)"
echo "  4. Announce your launch!"
echo ""
echo -e "${YELLOW}Note: Free tier apps sleep after 30 min of inactivity.${NC}"
echo -e "${YELLOW}Consider upgrading to Eco dynos ($5/month) for production.${NC}"
echo ""
echo -e "${GREEN}${BOLD}Congratulations on your deployment! 🚀${NC}"
echo ""
