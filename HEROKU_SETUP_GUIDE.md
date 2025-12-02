# Heroku Deployment Guide - DowUrk AI

## Heroku Questions Answered:

### Primary Development Language?

**Answer: Python**

- Your backend is FastAPI (Python)
- Frontend is React (JavaScript) but served as static files
- Heroku will detect Python from `requirements.txt`

---

## Complete Heroku Deployment Steps:

### Prerequisites:

1. ✅ Heroku account created
2. ✅ Heroku CLI installed
3. ✅ Git initialized (already done)

---

## Step 1: Install Heroku CLI

```bash
# Mac:
brew tap heroku/brew && brew install heroku

# Windows:
# Download from: https://devcenter.heroku.com/articles/heroku-cli

# Linux:
curl https://cli-assets.heroku.com/install.sh | sh

# Verify installation:
heroku --version
```

---

## Step 2: Login to Heroku

```bash
heroku login
# Opens browser for authentication
```

---

## Step 3: Create Heroku Apps

You need TWO apps:
1. Backend API
2. Frontend

```bash
# Create backend app:
heroku create dowurk-api

# Create frontend app:
heroku create dowurk-app

# Or let Heroku generate names:
# heroku create (backend)
# heroku create (frontend)
```

---

## Step 4: Set Environment Variables (Backend)

```bash
# Navigate to backend:
cd /app/backend

# Add MongoDB Atlas connection string:
heroku config:set MONGO_URL="YOUR_MONGODB_CONNECTION_STRING" --app dowurk-api

# Add secrets (generated earlier):
heroku config:set JWT_SECRET="02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0" --app dowurk-api
heroku config:set IP_ENCRYPTION_KEY="c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1" --app dowurk-api

# Add Stripe live key:
heroku config:set STRIPE_API_KEY="YOUR_STRIPE_LIVE_KEY" --app dowurk-api

# Add AI key:
heroku config:set EMERGENT_LLM_KEY="sk-emergent-d80Fd40DcEb594fBb2" --app dowurk-api

# Add CORS (update with your domain):
heroku config:set CORS_ORIGINS="https://www.dowurktoday.com,https://dowurktoday.com" --app dowurk-api

# Set environment:
heroku config:set ENVIRONMENT="production" --app dowurk-api
heroku config:set DEBUG="false" --app dowurk-api
```

---

## Step 5: Create Procfile (Backend)

Create `/app/backend/Procfile`:
```
web: uvicorn server:app --host 0.0.0.0 --port $PORT
```

---

## Step 6: Create runtime.txt (Backend)

Create `/app/backend/runtime.txt`:
```
python-3.11.6
```

---

## Step 7: Deploy Backend

```bash
cd /app/backend

# Initialize git if needed:
git init
git add .
git commit -m "Initial backend deployment"

# Add Heroku remote:
heroku git:remote -a dowurk-api

# Deploy:
git push heroku main

# Or if on master:
git push heroku master

# Check logs:
heroku logs --tail --app dowurk-api
```

---

## Step 8: Verify Backend

```bash
# Test health endpoint:
curl https://dowurk-api.herokuapp.com/api/monitoring/health

# Should return:
# {"status":"healthy","services":{...}}
```

---

## Step 9: Set Environment Variables (Frontend)

```bash
cd /app/frontend

# Set backend URL:
heroku config:set REACT_APP_BACKEND_URL="https://dowurk-api.herokuapp.com" --app dowurk-app
```

---

## Step 10: Create Buildpack Config (Frontend)

```bash
# Add Node.js buildpack:
heroku buildpacks:set heroku/nodejs --app dowurk-app

# Add static buildpack:
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static --app dowurk-app
```

Create `/app/frontend/static.json`:
```json
{
  "root": "build/",
  "routes": {
    "/**": "index.html"
  },
  "headers": {
    "/**": {
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    "/static/**": {
      "Cache-Control": "public, max-age=31536000"
    }
  },
  "https_only": true
}
```

---

## Step 11: Update package.json (Frontend)

Add to `/app/frontend/package.json`:
```json
{
  "scripts": {
    "heroku-postbuild": "yarn build"
  }
}
```

---

## Step 12: Deploy Frontend

```bash
cd /app/frontend

# Initialize git if needed:
git init
git add .
git commit -m "Initial frontend deployment"

# Add Heroku remote:
heroku git:remote -a dowurk-app

# Deploy:
git push heroku main

# Check logs:
heroku logs --tail --app dowurk-app
```

---

## Step 13: Custom Domain Setup

### For www.dowurktoday.com:

```bash
# Add domain to backend:
heroku domains:add api.dowurktoday.com --app dowurk-api
heroku domains:add www.dowurktoday.com --app dowurk-app
heroku domains:add dowurktoday.com --app dowurk-app

# Get DNS targets:
heroku domains --app dowurk-api
heroku domains --app dowurk-app
```

### Update DNS at ueni.com:

**Add these DNS records:**

1. **Frontend:**
   - Type: CNAME
   - Name: www
   - Value: [your-app-name].herokudns.com
   - TTL: 300

2. **Frontend (apex):**
   - Type: ALIAS or ANAME
   - Name: @
   - Value: [your-app-name].herokudns.com
   - TTL: 300

3. **Backend API:**
   - Type: CNAME
   - Name: api
   - Value: [your-api-app-name].herokudns.com
   - TTL: 300

### Enable SSL (Automatic on Heroku):

```bash
# SSL certificates are automatic and free!
heroku certs:auto:enable --app dowurk-api
heroku certs:auto:enable --app dowurk-app
```

---

## Step 14: Update CORS After Domain Setup

```bash
heroku config:set CORS_ORIGINS="https://www.dowurktoday.com,https://dowurktoday.com,https://api.dowurktoday.com" --app dowurk-api
```

---

## Step 15: Scale Dynos

```bash
# Ensure at least 1 web dyno:
heroku ps:scale web=1 --app dowurk-api
heroku ps:scale web=1 --app dowurk-app

# Check status:
heroku ps --app dowurk-api
heroku ps --app dowurk-app
```

---

## Monitoring Commands:

```bash
# View logs:
heroku logs --tail --app dowurk-api
heroku logs --tail --app dowurk-app

# Check dyno status:
heroku ps --app dowurk-api

# Restart if needed:
heroku restart --app dowurk-api

# Run database migrations (if needed):
heroku run python migrate.py --app dowurk-api
```

---

## Cost Estimate:

**Free Tier:**
- 2 apps x 550 dyno hours = 1100 hours/month (plenty!)
- Free SSL certificates
- Free domain setup
- $0/month

**Hobby Tier ($7/app/month = $14 total):**
- Better for production
- No sleeping
- Custom domains included
- SSL included

---

## Troubleshooting:

### If backend won't start:
```bash
heroku logs --tail --app dowurk-api
# Check for missing environment variables or Python errors
```

### If frontend shows blank:
```bash
# Check build logs:
heroku logs --app dowurk-app | grep "build"

# Verify REACT_APP_BACKEND_URL is set:
heroku config --app dowurk-app
```

### If CORS errors:
```bash
# Update CORS to include all domains:
heroku config:set CORS_ORIGINS="https://www.dowurktoday.com,https://dowurktoday.com,https://dowurk-app.herokuapp.com" --app dowurk-api
```

---

**Your apps will be live at:**
- Backend: https://dowurk-api.herokuapp.com
- Frontend: https://dowurk-app.herokuapp.com
- Custom: https://www.dowurktoday.com (after DNS propagation)
