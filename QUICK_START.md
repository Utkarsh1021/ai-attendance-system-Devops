# 🚀 Quick Start Guide

## 🎯 Choose Your Path

### **Path 1: Quick UI Test (2 minutes)**
Just want to see the new QR attendance feature UI?

```bash
# Double-click this file:
start-frontend-only.bat
```

**What you'll see:**
- ✅ Beautiful landing page
- ✅ Role selection (Student/Faculty/Admin)
- ✅ QR Scanner modal UI
- ✅ Face Capture modal UI
- ✅ All animations and designs

**What won't work:**
- ❌ Login/Registration (no backend)
- ❌ Actual QR scanning (no backend)
- ❌ Face recognition (no AI service)
- ❌ Database operations

**Access:** `http://localhost:3001`

---

### **Path 2: Full Stack Test (5 minutes)**
Want to test everything including QR scanning and face recognition?

```bash
# Double-click this file:
start-local.bat
```

**What you'll get:**
- ✅ Complete working system
- ✅ Backend API running
- ✅ AI face recognition working
- ✅ Database connected
- ✅ All features functional

**Services:**
- Backend: `http://localhost:8080`
- AI Service: `http://localhost:5000`
- Frontend: `http://localhost:3001`

---

### **Path 3: Manual Setup (10 minutes)**
Prefer to start services manually?

#### **Terminal 1 - Backend:**
```bash
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system
mvnw.cmd spring-boot:run
```

#### **Terminal 2 - AI Service:**
```bash
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system\ai-service
venv\Scripts\activate
python app.py
```

#### **Terminal 3 - Frontend:**
```bash
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system\attendance-frontend
set PORT=3001
npm start
```

---

## 📋 Prerequisites

Before starting, make sure you have:

- [ ] **Node.js 20+** - [Download](https://nodejs.org/)
- [ ] **Java 17+** - [Download](https://adoptium.net/)
- [ ] **Python 3.8+** - [Download](https://www.python.org/)
- [ ] **MySQL** - Use Docker or [Download](https://dev.mysql.com/downloads/)

**Check versions:**
```bash
node --version
java --version
python --version
```

---

## 🧪 Testing Your New QR Feature

Once the frontend is running:

### **1. Open the App**
Visit: `http://localhost:3001`

### **2. Navigate to Student Portal**
- Scroll down to "Choose Your Role"
- Click "Student" card
- Click "Sign In" tab

### **3. See the New Button**
After login (or on the dashboard), you'll see:
```
📷 Scan QR & Mark Attendance
```

### **4. Test QR Scanner**
- Click the button
- QR Scanner modal opens
- Camera permission requested
- Scanner interface displays

### **5. Test Face Capture**
- After scanning (or manually trigger)
- Face Capture modal opens
- Front camera activates
- Face guide displays

---

## 🎨 What's New in This Version

### **QR-Based Attendance System**

**New Components:**
1. **QRScannerModal** - Scan faculty QR codes
2. **FaceCaptureModal** - Capture face for verification
3. **Enhanced Student Dashboard** - New prominent button

**Features:**
- 📱 Mobile-first design
- 🎭 Dual verification (QR + Face)
- ⚡ Real-time feedback
- 🎨 Beautiful animations
- 🔐 Secure validation

**User Flow:**
```
Click Button → Scan QR → Capture Face → Attendance Marked ✓
```

---

## 📚 Documentation

- **[LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)** - Complete testing checklist
- **[VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)** - Deploy to production
- **[README.md](README.md)** - Full project documentation
- **[HOW_TO_USE_QR_ATTENDANCE.md](HOW_TO_USE_QR_ATTENDANCE.md)** - User guide

---

## 🐛 Troubleshooting

### **Port 3000 Already in Use**
Grafana is using port 3000. That's why we use port 3001.

**Solution:** Scripts automatically use port 3001

### **Backend Not Starting**
Check if MySQL is running:
```bash
docker ps | grep mysql
```

**Solution:** Start MySQL:
```bash
docker start persistent_db
```

### **Camera Not Working**
Browser needs camera permissions.

**Solution:** 
- Chrome: Settings → Privacy → Camera → Allow
- Use localhost or HTTPS

### **Dependencies Not Installing**
Clear cache and reinstall:
```bash
cd attendance-frontend
rm -rf node_modules package-lock.json
npm install
```

---

## 🎯 Next Steps

### **After Testing Locally:**

1. **✅ Verify all features work**
   - Use [LOCAL_TESTING_GUIDE.md](LOCAL_TESTING_GUIDE.md)

2. **🚀 Deploy to Production**
   - Follow [VERCEL_DEPLOYMENT_GUIDE.md](VERCEL_DEPLOYMENT_GUIDE.md)

3. **📝 Update Documentation**
   - Add screenshots
   - Update README with your info

4. **🌟 Push to GitHub**
   ```bash
   git add .
   git commit -m "Add QR attendance feature"
   git push origin main
   ```

---

## 💡 Tips

### **For Quick UI Testing:**
Use `start-frontend-only.bat` - fastest way to see the design

### **For Full Testing:**
Use `start-local.bat` - starts everything automatically

### **For Development:**
Start services manually in separate terminals for better control

### **For Deployment:**
Test locally first, then follow Vercel guide

---

## 📞 Need Help?

- **Email:** utkarshumang111@gmail.com
- **Documentation:** Check the guides in this folder
- **Issues:** Create a GitHub issue

---

## ✨ Quick Commands Reference

```bash
# Start frontend only
start-frontend-only.bat

# Start everything
start-local.bat

# Install dependencies
cd attendance-frontend && npm install

# Build for production
cd attendance-frontend && npm run build

# Test production build
cd attendance-frontend && npx serve -s build

# Deploy to Vercel
cd attendance-frontend && vercel --prod
```

---

**Ready to test? Double-click `start-frontend-only.bat` to begin!** 🚀
