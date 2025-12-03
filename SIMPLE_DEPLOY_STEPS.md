# 🚀 Simple Deployment Steps - Copy & Paste Commands

## ✅ Your Pre-Generated Secrets (SAVE THESE):

```
JWT_SECRET=02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0
IP_ENCRYPTION_KEY=c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1
```

---

## Step 1: Verify Prerequisites

```bash
# Check Heroku CLI:
heroku --version

# Login to Heroku (if not logged in):
heroku login
```

✅ **Continue only if Heroku CLI is installed and you're logged in.**

---

## Step 2: Get Your Credentials

### MongoDB Atlas Connection String:
**Format:**
```
mongodb+srv://USERNAME:PASSWORD@cluster0.xxxxx.mongodb.net/dowurk_production?retryWrites=true&w=majority
```

**Paste your MongoDB connection string here (save for next step):**
```
YOUR_MONGO_URL_HERE
```

### Stripe Live API Key:
**Format:** `sk_live_...`

**Paste your Stripe live key here (save for next step):**
```
YOUR_STRIPE_KEY_HERE
```

---

## Step 3: Create Heroku Apps

```bash
# Create backend app:
heroku create dowurk-api

# Create frontend app:
heroku create dowurk-app
```

**Save the URLs that appear!**

---

## Step 4: Set Backend Environment Variables

**Copy this entire block and replace YOUR_MONGO_URL and YOUR_STRIPE_KEY:**

```bash
heroku config:set \
  MONGO_URL="YOUR_MONGO_URL_HERE" \
  JWT_SECRET="02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0" \
  IP_ENCRYPTION_KEY="c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1" \
  STRIPE_API_KEY="YOUR_STRIPE_KEY_HERE" \
  EMERGENT_LLM_KEY="sk-emergent-d80Fd40DcEb594fBb2" \
  CORS_ORIGINS="*" \
  ENVIRONMENT="production" \
  DEBUG="false" \
  --app dowurk-api
```

---

## Step 5: Set Frontend Environment Variable

```bash
heroku config:set \
  REACT_APP_BACKEND_URL="https://dowurk-api.herokuapp.com" \
  --app dowurk-app
```

---

## Step 6: Deploy Backend

```bash
cd /app/backend

# Initialize git if needed:
git init
git add .
git commit -m "Initial deployment"

# Add Heroku remote:
heroku git:remote -a dowurk-api

# Deploy:
git push heroku main
# If that fails, try: git push heroku master

# Scale dyno:
heroku ps:scale web=1 --app dowurk-api
```

---

## Step 7: Deploy Frontend

```bash
cd /app/frontend

# Set buildpacks:
heroku buildpacks:set heroku/nodejs --app dowurk-app
heroku buildpacks:add https://github.com/heroku/heroku-buildpack-static --app dowurk-app

# Initialize git if needed:
git init
git add .
git commit -m "Initial deployment"

# Add Heroku remote:
heroku git:remote -a dowurk-app

# Deploy:
git push heroku main
# If that fails, try: git push heroku master

# Scale dyno:
heroku ps:scale web=1 --app dowurk-app
```

---

## Step 8: Test Your Deployment

```bash
# Test backend health:
curl https://dowurk-api.herokuapp.com/api/monitoring/health

# Open frontend in browser:
# Go to: https://dowurk-app.herokuapp.com
```

---

## Step 9: Check Logs (if needed)

```bash
# Backend logs:
heroku logs --tail --app dowurk-api

# Frontend logs:
heroku logs --tail --app dowurk-app
```

---

## 🎉 Success!

**Your apps are live at:**
- Backend: https://dowurk-api.herokuapp.com
- Frontend: https://dowurk-app.herokuapp.com

**Test everything:**
1. Register a new user
2. Try AI features
3. Test payment (card: 4242 4242 4242 4242)

---

## 🔧 Update CORS After Testing

Once you verify everything works, update CORS to your domain:

```bash
heroku config:set \
  CORS_ORIGINS="https://dowurk-app.herokuapp.com,https://www.dowurktoday.com,https://dowurktoday.com" \
  --app dowurk-api
```

---

## Common Issues:

**"No such app":**
- Use exact app names you created
- Check: `heroku apps`

**"Permission denied":**
- Make sure you're logged in: `heroku login`

**"Failed to push":**
- Try: `git push heroku master` instead of main
- Check branch: `git branch`

**"Application error":**
- Check logs: `heroku logs --tail --app APP_NAME`
- Verify environment variables: `heroku config --app APP_NAME`
