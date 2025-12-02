# 🚀 DowUrk AI - Complete Deployment Guide

## ✅ What I've Completed For You:

### 1. Generated Secure Secrets ✅

**Copy these into your .env files:**

```bash
JWT_SECRET=02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0
IP_ENCRYPTION_KEY=c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1
```

**⚠️ IMPORTANT:** These are cryptographically secure. Save them securely!

---

### 2. Created Environment Templates ✅

**Files created:**
- `/app/.env.production.template` - Backend environment variables
- `/app/frontend/.env.production.template` - Frontend environment variables

**What to do:**
1. Copy `.env.production.template` to `/app/backend/.env`
2. Replace all `[PLACEHOLDER]` values with your actual credentials
3. The JWT and IP encryption keys are already filled in!

---

### 3. Answered Your Questions ✅

**MongoDB Atlas:** See `/app/MONGODB_ATLAS_ANSWERS.md`
- Language: **Python** ✅
- Data types: **Documents/JSON, Text/Content, Time Series** ✅
- Architecture: **Serverless, Microservices, Web Application** ✅
- Cluster: **M0 Free Tier, AWS, us-east-1** ✅

**Heroku:**
- Primary language: **Python** ✅

**Domain:** See `/app/DOMAIN_RECOMMENDATIONS.md`
- **Use: www.dowurktoday.com** (.com is best!) ✅
- Redirect .org to .com ✅
- Setup: api.dowurktoday.com for backend ✅

---

### 4. Created Heroku Deployment Files ✅

**Backend:**
- `/app/backend/Procfile` - Tells Heroku how to run backend
- `/app/backend/runtime.txt` - Specifies Python version

**Frontend:**
- `/app/frontend/static.json` - Configures static file serving
- Updated `package.json` with build command

---

### 5. Created Deployment Scripts ✅

**Scripts:**
- `/app/deploy.sh` - Automated deployment to Heroku
- `/app/verify_deployment.sh` - Verify everything works after deployment

**Make executable:**
```bash
chmod +x /app/deploy.sh
chmod +x /app/verify_deployment.sh
```

---

### 6. Created Complete Guides ✅

**Documentation:**
- `/app/MONGODB_ATLAS_ANSWERS.md` - MongoDB setup answers
- `/app/HEROKU_SETUP_GUIDE.md` - Step-by-step Heroku deployment
- `/app/DOMAIN_RECOMMENDATIONS.md` - Domain strategy & DNS setup
- `/app/DEPLOYMENT_CHECKLIST.md` - Complete pre-deployment checklist

---

## 📋 What YOU Need To Do:

### Step 1: MongoDB Atlas (15 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster:
   - Name: `dowurk-production`
   - Tier: M0 (Free)
   - Provider: AWS
   - Region: us-east-1
4. Create database user:
   - Username: `dowurk_admin`
   - Password: [Generate strong password]
5. Network Access:
   - Add IP: `0.0.0.0/0` (allow from anywhere)
6. Get connection string:
   - Click "Connect" → "Connect your application"
   - Copy connection string
   - Replace `<password>` with your password
   - Replace `<dbname>` with `dowurk_production`

**Example:**
```
mongodb+srv://dowurk_admin:YOUR_PASSWORD@dowurk-production.xxxxx.mongodb.net/dowurk_production?retryWrites=true&w=majority
```

---

### Step 2: Stripe Live Mode (10 minutes)

1. Go to https://dashboard.stripe.com
2. Toggle "Test mode" OFF (top right) → "Live mode"
3. Go to Developers → API keys
4. Copy "Secret key" (starts with `sk_live_`)
5. Save securely!

**Note:** Your test payment link won't work in live mode. You'll get a new one.

---

### Step 3: Update Environment Variables (15 minutes)

**Backend (.env):**

1. Copy template:
```bash
cp /app/.env.production.template /app/backend/.env
```

2. Edit `/app/backend/.env`:
```bash
# Already done for you:
JWT_SECRET=02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0
IP_ENCRYPTION_KEY=c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1

# YOU NEED TO ADD:
MONGO_URL=mongodb+srv://dowurk_admin:YOUR_PASSWORD@...
STRIPE_API_KEY=sk_live_YOUR_STRIPE_KEY
CORS_ORIGINS=https://www.dowurktoday.com,https://dowurktoday.com
```

**Frontend (.env.production):**

1. Create file:
```bash
cp /app/frontend/.env.production.template /app/frontend/.env.production
```

2. For now, use Heroku URL (we'll update after deployment):
```bash
REACT_APP_BACKEND_URL=https://dowurk-api.herokuapp.com
```

---

### Step 4: Deploy to Heroku (60 minutes)

**Option A: Use automated script (easiest):**

```bash
cd /app
chmod +x deploy.sh
./deploy.sh
```

**Option B: Manual deployment:**

Follow step-by-step guide in `/app/HEROKU_SETUP_GUIDE.md`

**Key steps:**
1. Install Heroku CLI
2. Login: `heroku login`
3. Create apps: `heroku create dowurk-api` and `heroku create dowurk-app`
4. Set environment variables in Heroku
5. Deploy backend
6. Deploy frontend

---

### Step 5: Verify Deployment (15 minutes)

**Automated verification:**
```bash
cd /app
chmod +x verify_deployment.sh
./verify_deployment.sh
```

**Manual tests:**
1. Test backend health:
```bash
curl https://dowurk-api.herokuapp.com/api/monitoring/health
```

2. Open frontend in browser:
```
https://dowurk-app.herokuapp.com
```

3. Try registering a test user
4. Test AI features
5. Test payment flow (use test card: 4242 4242 4242 4242)

---

### Step 6: Connect Custom Domain (Optional - can do later)

**After testing on Heroku URLs:**

1. Add domains to Heroku:
```bash
heroku domains:add api.dowurktoday.com --app dowurk-api
heroku domains:add www.dowurktoday.com --app dowurk-app
```

2. Get DNS targets:
```bash
heroku domains --app dowurk-api
```

3. Update DNS at ueni.com:
   - Add CNAME record for `api` pointing to Heroku DNS
   - Add CNAME record for `www` pointing to Heroku DNS

4. Wait for DNS propagation (5 mins - 48 hours)

5. Update CORS in Heroku:
```bash
heroku config:set CORS_ORIGINS="https://www.dowurktoday.com,https://dowurktoday.com" --app dowurk-api
```

See `/app/DOMAIN_RECOMMENDATIONS.md` for detailed instructions.

---

## 📊 Quick Reference:

### Your Generated Secrets:
```
JWT_SECRET=02e7090506d227411db8b2fafd70f7b152ed37c4f26a82a30c73d318399229b0
IP_ENCRYPTION_KEY=c78722fe7f36200fdba65f14a116e7851a31797845e2819a2fc0aa487f603de1
```

### MongoDB Atlas Answers:
- Language: Python
- Data: Documents/JSON, Text, Time Series
- Architecture: Serverless, Microservices, Web App

### Heroku Answer:
- Primary language: Python

### Domain Recommendation:
- Use: www.dowurktoday.com (.com)
- API: api.dowurktoday.com
- Redirect: .org → .com

---

## ✅ Deployment Checklist:

**Before deploying:**
- [ ] MongoDB Atlas cluster created
- [ ] MongoDB connection string obtained
- [ ] Stripe switched to live mode
- [ ] Stripe live API key obtained
- [ ] Backend .env file updated
- [ ] Frontend .env.production created

**Deploying:**
- [ ] Heroku CLI installed
- [ ] Heroku apps created (2 apps)
- [ ] Environment variables set in Heroku
- [ ] Backend deployed
- [ ] Frontend deployed

**After deploying:**
- [ ] Health check passes
- [ ] Frontend loads correctly
- [ ] Can register new user
- [ ] AI features work
- [ ] Payment flow works
- [ ] Custom domain connected (optional)

---

## 🚀 Estimated Timeline:

| Task | Time |
|------|------|
| MongoDB Atlas setup | 15 min |
| Stripe live mode | 10 min |
| Update environment vars | 15 min |
| Deploy to Heroku | 60 min |
| Verify deployment | 15 min |
| Connect custom domain | 30 min |
| **Total** | **2-3 hours** |

---

## 🎯 Next Steps:

**RIGHT NOW:**
1. Set up MongoDB Atlas (15 min)
2. Switch Stripe to live mode (10 min)
3. Update environment variables (15 min)

**THEN:**
1. Deploy to Heroku (60 min)
2. Run verification tests (15 min)
3. **GO LIVE!** 🎉

**THIS WEEK:**
1. Connect custom domain (30 min)
2. Monitor for issues
3. Gather user feedback

---

## 📞 Need Help?

**Guides available:**
- MongoDB: `/app/MONGODB_ATLAS_ANSWERS.md`
- Heroku: `/app/HEROKU_SETUP_GUIDE.md`
- Domain: `/app/DOMAIN_RECOMMENDATIONS.md`
- Full checklist: `/app/DEPLOYMENT_CHECKLIST.md`

**Scripts available:**
- Deploy: `./deploy.sh`
- Verify: `./verify_deployment.sh`

---

**🎉 Everything is ready! You're 3 steps away from going live!**

1. MongoDB Atlas setup
2. Stripe live mode
3. Deploy to Heroku

**Let's launch! 🚀**
