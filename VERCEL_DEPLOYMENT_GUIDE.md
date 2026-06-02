# 🚀 Vercel Deployment Guide

## ⚠️ Important Note About Vercel

**Vercel is designed for frontend applications only.** Your project has:
- ✅ **Frontend (React)** - Can deploy to Vercel
- ❌ **Backend (Spring Boot)** - Cannot deploy to Vercel
- ❌ **AI Service (Flask)** - Cannot deploy to Vercel
- ❌ **Database (MySQL)** - Cannot deploy to Vercel

### **Recommended Deployment Strategy:**

| Component | Platform | Why |
|-----------|----------|-----|
| **Frontend** | Vercel | Perfect for React apps, free tier, auto-deploy |
| **Backend** | Railway / Render / Heroku | Java Spring Boot support |
| **AI Service** | Railway / Render / PythonAnywhere | Python Flask support |
| **Database** | PlanetScale / Railway / Supabase | MySQL hosting |

---

## 🎯 Deployment Options

### **Option 1: Frontend Only on Vercel (Quick Demo)**

Deploy just the React frontend to Vercel for UI showcase.

**Pros:**
- ✅ Free and fast
- ✅ Auto-deploy from Git
- ✅ Great for portfolio/demo

**Cons:**
- ❌ No backend functionality
- ❌ No database
- ❌ No face recognition

**Use Case:** Show off your UI/UX design

---

### **Option 2: Full Stack Deployment (Recommended)**

Deploy all components to appropriate platforms.

**Architecture:**
```
Frontend (Vercel) → Backend (Railway) → Database (PlanetScale)
                  ↓
            AI Service (Render)
```

**Pros:**
- ✅ Fully functional
- ✅ Production-ready
- ✅ Scalable

**Cons:**
- ❌ Requires multiple platforms
- ❌ Some services may have costs

---

## 📦 Option 1: Deploy Frontend to Vercel

### **Step 1: Prepare Frontend for Deployment**

#### **1.1 Create Environment Variables File**

Create `attendance-frontend/.env.production`:

```env
# Backend API URL (will be updated after backend deployment)
REACT_APP_API_URL=https://your-backend-url.railway.app

# AI Service URL (will be updated after AI service deployment)
REACT_APP_AI_SERVICE_URL=https://your-ai-service.onrender.com
```

#### **1.2 Update API Calls**

The frontend should use environment variables for API URLs.

Check `attendance-frontend/src/App.js` and other components use:
```javascript
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const AI_URL = process.env.REACT_APP_AI_SERVICE_URL || 'http://localhost:5000';
```

#### **1.3 Test Production Build**

```bash
cd attendance-frontend

# Build for production
npm run build

# Test the build locally
npx serve -s build
```

Visit `http://localhost:3000` to test the production build.

### **Step 2: Deploy to Vercel**

#### **2.1 Install Vercel CLI**

```bash
npm install -g vercel
```

#### **2.2 Login to Vercel**

```bash
vercel login
```

#### **2.3 Deploy**

```bash
cd attendance-frontend

# Deploy
vercel

# Follow the prompts:
# - Set up and deploy? Yes
# - Which scope? Your account
# - Link to existing project? No
# - Project name? attendance-system
# - Directory? ./
# - Override settings? No
```

#### **2.4 Set Environment Variables**

```bash
# Add environment variables
vercel env add REACT_APP_API_URL production
# Enter: https://your-backend-url.railway.app

vercel env add REACT_APP_AI_SERVICE_URL production
# Enter: https://your-ai-service.onrender.com
```

#### **2.5 Deploy to Production**

```bash
vercel --prod
```

### **Step 3: Configure Custom Domain (Optional)**

```bash
# Add custom domain
vercel domains add yourdomain.com

# Follow DNS configuration instructions
```

---

## 🚂 Option 2: Full Stack Deployment

### **Part A: Deploy Backend to Railway**

#### **1. Sign Up for Railway**
- Go to [railway.app](https://railway.app)
- Sign up with GitHub

#### **2. Create New Project**
- Click "New Project"
- Select "Deploy from GitHub repo"
- Connect your repository
- Select the attendance-system repo

#### **3. Configure Backend Service**

Create `railway.json` in project root:

```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS",
    "buildCommand": "mvn clean install -DskipTests"
  },
  "deploy": {
    "startCommand": "java -jar target/attendance-system-0.0.1-SNAPSHOT.jar",
    "restartPolicyType": "ON_FAILURE",
    "restartPolicyMaxRetries": 10
  }
}
```

#### **4. Add Environment Variables**

In Railway dashboard, add:
```
SPRING_DATASOURCE_URL=jdbc:mysql://your-db-host:3306/userdb
SPRING_DATASOURCE_USERNAME=your-db-user
SPRING_DATASOURCE_PASSWORD=your-db-password
JWT_SECRET=your-secret-key-here
```

#### **5. Deploy**
- Railway will auto-deploy
- Get your backend URL: `https://your-app.railway.app`

---

### **Part B: Deploy Database to PlanetScale**

#### **1. Sign Up for PlanetScale**
- Go to [planetscale.com](https://planetscale.com)
- Sign up (free tier available)

#### **2. Create Database**
- Click "New database"
- Name: `attendance-db`
- Region: Choose closest to you
- Click "Create database"

#### **3. Get Connection String**
- Go to "Connect"
- Select "Java" or "General"
- Copy connection string
- Update Railway environment variables

#### **4. Initialize Schema**
- Spring Boot will auto-create tables
- Or manually run SQL scripts

---

### **Part C: Deploy AI Service to Render**

#### **1. Sign Up for Render**
- Go to [render.com](https://render.com)
- Sign up with GitHub

#### **2. Create Web Service**
- Click "New +"
- Select "Web Service"
- Connect your repository
- Select the attendance-system repo

#### **3. Configure Service**

**Settings:**
```
Name: attendance-ai-service
Root Directory: ai-service
Environment: Python 3
Build Command: pip install -r requirements.txt
Start Command: python app.py
```

#### **4. Add Environment Variables**

```
FLASK_ENV=production
PORT=5000
```

#### **5. Deploy**
- Render will auto-deploy
- Get your AI service URL: `https://your-ai-service.onrender.com`

---

### **Part D: Deploy Frontend to Vercel**

Follow the steps from Option 1, but use the actual backend and AI service URLs.

---

## 🔧 Post-Deployment Configuration

### **1. Update CORS Settings**

In `SecurityConfig.java`, update allowed origins:

```java
configuration.setAllowedOrigins(
    List.of(
        "http://localhost:3000",
        "http://localhost:3001",
        "https://your-vercel-app.vercel.app",
        "https://yourdomain.com"
    )
);
```

### **2. Update API URLs in Frontend**

Update `.env.production`:
```env
REACT_APP_API_URL=https://your-backend.railway.app
REACT_APP_AI_SERVICE_URL=https://your-ai-service.onrender.com
```

### **3. Test All Endpoints**

```bash
# Test backend
curl https://your-backend.railway.app/students/

# Test AI service
curl https://your-ai-service.onrender.com/

# Test frontend
curl https://your-app.vercel.app
```

---

## 🔐 Security Checklist

Before going live:

- [ ] Change default admin password
- [ ] Use strong JWT secret
- [ ] Enable HTTPS everywhere
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable database backups
- [ ] Set up monitoring
- [ ] Configure error logging
- [ ] Add security headers
- [ ] Validate all inputs

---

## 📊 Monitoring & Analytics

### **1. Vercel Analytics**
- Enable in Vercel dashboard
- Track page views, performance

### **2. Backend Monitoring**
- Railway provides logs
- Set up alerts for errors

### **3. Database Monitoring**
- PlanetScale provides insights
- Monitor query performance

---

## 💰 Cost Estimation

### **Free Tier Limits:**

| Service | Free Tier | Limits |
|---------|-----------|--------|
| **Vercel** | Yes | 100GB bandwidth/month |
| **Railway** | $5 credit/month | ~500 hours |
| **Render** | Yes | 750 hours/month |
| **PlanetScale** | Yes | 5GB storage, 1B reads |

**Total Monthly Cost:** $0 - $10 (depending on usage)

---

## 🚀 Deployment Commands Cheat Sheet

### **Vercel:**
```bash
# Deploy to preview
vercel

# Deploy to production
vercel --prod

# View logs
vercel logs

# List deployments
vercel ls
```

### **Railway:**
```bash
# Install CLI
npm install -g @railway/cli

# Login
railway login

# Link project
railway link

# Deploy
railway up

# View logs
railway logs
```

### **Render:**
- Deploys automatically on git push
- View logs in dashboard

---

## 🐛 Troubleshooting Deployment Issues

### **Issue: Build Fails on Vercel**

**Solution:**
```bash
# Check build locally
npm run build

# Fix any errors
# Commit and push
git add .
git commit -m "Fix build errors"
git push
```

### **Issue: Backend Not Connecting to Database**

**Solution:**
- Check connection string
- Verify database is running
- Check firewall rules
- Test connection locally

### **Issue: CORS Errors**

**Solution:**
- Add Vercel URL to CORS origins
- Redeploy backend
- Clear browser cache

### **Issue: AI Service Timeout**

**Solution:**
- Increase timeout in Render settings
- Optimize face recognition code
- Use smaller image sizes

---

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Railway Documentation](https://docs.railway.app)
- [Render Documentation](https://render.com/docs)
- [PlanetScale Documentation](https://planetscale.com/docs)

---

## 🎯 Quick Start Commands

### **Deploy Everything:**

```bash
# 1. Deploy Frontend to Vercel
cd attendance-frontend
vercel --prod

# 2. Deploy Backend to Railway
railway up

# 3. Deploy AI Service to Render
# (Push to GitHub, Render auto-deploys)

# 4. Update environment variables
vercel env add REACT_APP_API_URL production
vercel env add REACT_APP_AI_SERVICE_URL production

# 5. Redeploy frontend
vercel --prod
```

---

## ✅ Deployment Checklist

- [ ] Frontend builds successfully
- [ ] Backend runs locally
- [ ] AI service runs locally
- [ ] Database is accessible
- [ ] Environment variables set
- [ ] CORS configured
- [ ] Security settings updated
- [ ] Frontend deployed to Vercel
- [ ] Backend deployed to Railway
- [ ] AI service deployed to Render
- [ ] Database deployed to PlanetScale
- [ ] All services connected
- [ ] End-to-end testing complete
- [ ] Custom domain configured (optional)
- [ ] Monitoring set up
- [ ] Documentation updated

---

## 🎉 You're Live!

Once deployed, your application will be accessible at:

- **Frontend:** `https://your-app.vercel.app`
- **Backend:** `https://your-backend.railway.app`
- **AI Service:** `https://your-ai-service.onrender.com`

Share your live URL and showcase your project! 🚀

---

**Need Help?** Check the troubleshooting section or reach out to:
- Email: utkarshumang111@gmail.com
- GitHub Issues: [Your Repo Issues](https://github.com/yourusername/attendance-system/issues)
