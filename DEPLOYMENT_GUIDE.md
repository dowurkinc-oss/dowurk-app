# DowUrk AI Hub - Deployment Guide

This guide provides step-by-step instructions for deploying the DowUrk AI Hub application, including all required environment variables and configuration.

---

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Environment Variables](#environment-variables)
3. [Backend Deployment](#backend-deployment)
4. [Frontend Deployment](#frontend-deployment)
5. [Database Setup](#database-setup)
6. [Production Deployment Options](#production-deployment-options)
7. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### System Requirements
- **Node.js**: v18+ (v22 recommended)
- **Python**: 3.11+
- **MongoDB**: 6.0+ (or MongoDB Atlas)
- **Package Managers**: yarn (frontend), pip (backend)

### Accounts Needed
- **MongoDB Atlas** (free tier available): https://www.mongodb.com/atlas
- **OpenAI API** (or compatible): For AI features
- **Louisiana SOS API** (optional, $500/year for live data): https://subscriptions.sos.la.gov

---

## Environment Variables

### Backend Environment Variables

Create a `.env` file in the `/backend` directory:

```bash
# /backend/.env

# ============================================
# REQUIRED - Database
# ============================================
MONGO_URL=mongodb+srv://username:password@cluster.mongodb.net/?retryWrites=true&w=majority
DB_NAME=dowurk_db

# ============================================
# REQUIRED - Authentication
# ============================================
JWT_SECRET=your-super-secure-secret-key-change-in-production-minimum-32-chars

# ============================================
# REQUIRED - AI Services
# ============================================
OPENAI_API_KEY=sk-your-openai-api-key-here

# ============================================
# OPTIONAL - Louisiana SOS API
# ============================================
# Test token is included by default (free, returns test data)
# For live production data, subscribe at https://subscriptions.sos.la.gov ($500/year)
LA_SOS_API_TOKEN=z5AjcETzZOTrn28GtYUbDQDTLuqlUhsXUlG
LA_SOS_API_EMAIL=info@dowurktoday.org

# ============================================
# OPTIONAL - Server Configuration
# ============================================
HOST=0.0.0.0
PORT=8000
DEBUG=false
```

### Frontend Environment Variables

Create a `.env` file in the `/frontend` directory:

```bash
# /frontend/.env

# ============================================
# REQUIRED - Backend API URL
# ============================================
REACT_APP_BACKEND_URL=http://localhost:8000

# For production, use your deployed backend URL:
# REACT_APP_BACKEND_URL=https://api.dowurktoday.org
```

### Environment Variable Reference

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `MONGO_URL` | Yes | - | MongoDB connection string |
| `DB_NAME` | Yes | - | MongoDB database name |
| `JWT_SECRET` | Yes | `your-secret-key-change-in-production` | Secret key for JWT tokens (min 32 chars) |
| `OPENAI_API_KEY` | Yes | - | OpenAI API key for AI features |
| `LA_SOS_API_TOKEN` | No | Test token included | Louisiana SOS API token |
| `LA_SOS_API_EMAIL` | No | `info@dowurktoday.org` | Email for LA SOS API |
| `HOST` | No | `0.0.0.0` | Backend server host |
| `PORT` | No | `8000` | Backend server port |
| `REACT_APP_BACKEND_URL` | Yes | - | Backend API URL for frontend |

---

## Backend Deployment

### Step 1: Clone the Repository

```bash
git clone https://github.com/dowurkinc-oss/dowurk-app.git
cd dowurk-app
```

### Step 2: Set Up Python Environment

```bash
cd backend

# Create virtual environment (recommended)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### Step 3: Configure Environment

```bash
# Copy the example env file and edit
cp .env.example .env
nano .env  # or use your preferred editor

# Fill in your values:
# - MONGO_URL: Your MongoDB connection string
# - DB_NAME: Your database name (e.g., dowurk_db)
# - JWT_SECRET: Generate a secure random string
# - OPENAI_API_KEY: Your OpenAI API key
```

### Step 4: Run the Backend

**Development:**
```bash
uvicorn server:app --reload --host 0.0.0.0 --port 8000
```

**Production:**
```bash
uvicorn server:app --host 0.0.0.0 --port 8000 --workers 4
```

### Step 5: Verify Backend is Running

```bash
curl http://localhost:8000/api/
# Should return: {"message": "Welcome to The DowUrk FramewUrk API", "version": "1.0.0"}
```

---

## Frontend Deployment

### Step 1: Navigate to Frontend Directory

```bash
cd frontend
```

### Step 2: Install Dependencies

```bash
# Using yarn (recommended - project is configured for yarn)
yarn install

# Or using npm
npm install --legacy-peer-deps
```

### Step 3: Configure Environment

```bash
# Create .env file
echo "REACT_APP_BACKEND_URL=http://localhost:8000" > .env
```

### Step 4: Run the Frontend

**Development:**
```bash
yarn start
# Opens at http://localhost:3000
```

**Production Build:**
```bash
yarn build
# Creates optimized build in /build directory
```

### Step 5: Serve Production Build

```bash
# Using serve (install globally: npm install -g serve)
serve -s build -l 3000

# Or using nginx, Apache, etc.
```

---

## Database Setup

### MongoDB Atlas (Recommended)

1. **Create Account**: Go to https://www.mongodb.com/atlas and sign up

2. **Create Cluster**: 
   - Choose M0 (Free tier) for development
   - Select your preferred region

3. **Configure Network Access**:
   - Go to Network Access → Add IP Address
   - Add `0.0.0.0/0` for development (restrict in production)

4. **Create Database User**:
   - Go to Database Access → Add New Database User
   - Create username and password
   - Grant "Read and write to any database" role

5. **Get Connection String**:
   - Go to Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password

**Example Connection String:**
```
mongodb+srv://dowurkuser:YourPassword123@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
```

### Local MongoDB (Alternative)

```bash
# Install MongoDB
sudo apt-get install mongodb

# Start MongoDB
sudo systemctl start mongodb

# Connection string for local:
MONGO_URL=mongodb://localhost:27017
```

---

## Production Deployment Options

### Option 1: Railway (Recommended for Simplicity)

1. **Backend:**
   ```bash
   # Install Railway CLI
   npm install -g @railway/cli
   
   # Login and deploy
   railway login
   cd backend
   railway init
   railway up
   ```

2. **Frontend:**
   ```bash
   cd frontend
   railway init
   railway up
   ```

3. **Set Environment Variables** in Railway dashboard

### Option 2: Render

1. **Backend (Web Service):**
   - Connect GitHub repository
   - Build Command: `pip install -r requirements.txt`
   - Start Command: `uvicorn server:app --host 0.0.0.0 --port $PORT`

2. **Frontend (Static Site):**
   - Build Command: `yarn install && yarn build`
   - Publish Directory: `build`

### Option 3: DigitalOcean App Platform

1. Create App from GitHub repository
2. Configure backend as Web Service
3. Configure frontend as Static Site
4. Set environment variables in App settings

### Option 4: AWS (EC2 + S3/CloudFront)

**Backend on EC2:**
```bash
# Install dependencies
sudo apt update
sudo apt install python3-pip nginx

# Clone and setup
git clone https://github.com/dowurkinc-oss/dowurk-app.git
cd dowurk-app/backend
pip3 install -r requirements.txt

# Run with systemd
sudo nano /etc/systemd/system/dowurk-api.service
```

```ini
[Unit]
Description=DowUrk API
After=network.target

[Service]
User=ubuntu
WorkingDirectory=/home/ubuntu/dowurk-app/backend
ExecStart=/usr/bin/uvicorn server:app --host 0.0.0.0 --port 8000
Restart=always

[Install]
WantedBy=multi-user.target
```

```bash
sudo systemctl enable dowurk-api
sudo systemctl start dowurk-api
```

**Frontend on S3 + CloudFront:**
```bash
# Build frontend
cd frontend
yarn build

# Upload to S3
aws s3 sync build/ s3://your-bucket-name --delete

# Configure CloudFront for HTTPS
```

### Option 5: Docker Deployment

**Backend Dockerfile:**
```dockerfile
FROM python:3.11-slim

WORKDIR /app
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

COPY . .
EXPOSE 8000

CMD ["uvicorn", "server:app", "--host", "0.0.0.0", "--port", "8000"]
```

**Frontend Dockerfile:**
```dockerfile
FROM node:22-alpine as build
WORKDIR /app
COPY package.json yarn.lock ./
RUN yarn install
COPY . .
RUN yarn build

FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
```

**docker-compose.yml:**
```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8000:8000"
    environment:
      - MONGO_URL=${MONGO_URL}
      - DB_NAME=${DB_NAME}
      - JWT_SECRET=${JWT_SECRET}
      - OPENAI_API_KEY=${OPENAI_API_KEY}
    
  frontend:
    build: ./frontend
    ports:
      - "3000:80"
    depends_on:
      - backend
```

---

## Louisiana SOS API Configuration

### Test Mode (Default)
The application includes a test token that works out of the box. Test mode:
- Returns test/sample data (not real business records)
- Free to use
- Good for development and testing
- Token expires: 1/19/2027

### Production Mode
For real Louisiana business data:

1. **Subscribe**: Go to https://subscriptions.sos.la.gov
2. **Cost**: $500/year
3. **Get Token**: After subscription, you'll receive a live token
4. **Update Environment**:
   ```bash
   LA_SOS_API_TOKEN=your-live-token-here
   LA_SOS_API_EMAIL=your-registered-email@domain.com
   ```

---

## Troubleshooting

### Common Issues

**1. MongoDB Connection Failed**
```
Error: MongoServerError: bad auth
```
- Verify username/password in connection string
- Check IP whitelist in MongoDB Atlas
- Ensure database user has correct permissions

**2. OpenAI API Error**
```
Error: Invalid API key
```
- Verify OPENAI_API_KEY is set correctly
- Check API key hasn't expired
- Ensure sufficient credits in OpenAI account

**3. CORS Errors**
```
Access-Control-Allow-Origin error
```
- Verify REACT_APP_BACKEND_URL matches actual backend URL
- Check CORS configuration in server.py

**4. Frontend Can't Connect to Backend**
```
Network Error / Connection Refused
```
- Ensure backend is running
- Check REACT_APP_BACKEND_URL is correct
- Verify firewall allows port 8000

**5. JWT Token Invalid**
```
Error: Could not validate credentials
```
- Ensure JWT_SECRET is the same across all backend instances
- Check token hasn't expired
- Clear browser storage and re-login

### Health Checks

**Backend Health:**
```bash
curl http://localhost:8000/api/
```

**Database Connection:**
```bash
curl http://localhost:8000/api/businesses
```

**AI Service:**
```bash
curl -X POST http://localhost:8000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Hello"}'
```

**Louisiana SOS API:**
```bash
curl -X POST http://localhost:8000/api/la-sos/search \
  -H "Content-Type: application/json" \
  -d '{"entity_name": "Test"}'
```

---

## Security Checklist

Before going to production:

- [ ] Change `JWT_SECRET` to a strong, unique value (32+ characters)
- [ ] Restrict MongoDB IP whitelist to your server IPs only
- [ ] Use HTTPS for all connections
- [ ] Set `DEBUG=false` in production
- [ ] Review and restrict CORS origins
- [ ] Enable rate limiting
- [ ] Set up monitoring and logging
- [ ] Configure backup for MongoDB
- [ ] Use environment variables (never commit secrets)

---

## Support

For deployment assistance:
- **DowUrk Inc.**: https://www.dowurktoday.org
- **GitHub Issues**: https://github.com/dowurkinc-oss/dowurk-app/issues

---

*Last Updated: January 2025*
