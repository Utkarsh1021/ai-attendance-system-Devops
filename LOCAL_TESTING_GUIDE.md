# 🧪 Local Testing Guide - Before Vercel Deployment

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [ ] **Node.js 20+** installed (`node --version`)
- [ ] **Java 17+** installed (`java --version`)
- [ ] **Python 3.8+** installed (`python --version`)
- [ ] **MySQL 8.0+** running (or Docker)
- [ ] **Git** installed
- [ ] **Code editor** (VS Code recommended)

---

## 🎯 Quick Start - Simplest Way to Test

### **Option 1: Frontend Only (Fastest for UI Testing)**

This is the quickest way to see your new QR attendance feature:

```bash
# 1. Navigate to frontend
cd attendance-frontend

# 2. Install dependencies
npm install

# 3. Start development server on port 3001 (since 3000 is used by Grafana)
set PORT=3001
npm start
```

**Access:** `http://localhost:3001`

**Note:** Backend features won't work, but you can see the UI and design.

---

### **Option 2: Full Stack Testing (Recommended)**

Run all services locally for complete testing.

#### **Step 1: Start MySQL Database**

**Using Docker (Easiest):**
```bash
docker run --name attendance-mysql -e MYSQL_ROOT_PASSWORD=rootpass -e MYSQL_DATABASE=userdb -e MYSQL_USER=appuser -e MYSQL_PASSWORD=apppass -p 3306:3306 -d mysql:8.0
```

**Or use your existing `persistent_db`:**
```bash
# Check if it's running
docker ps | grep persistent_db

# If not running, start it
docker start persistent_db
```

#### **Step 2: Start Backend (Spring Boot)**

Open **Terminal 1:**
```bash
# Navigate to project root
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system

# Set environment variables
set SPRING_DATASOURCE_URL=jdbc:mysql://localhost:3306/userdb
set SPRING_DATASOURCE_USERNAME=appuser
set SPRING_DATASOURCE_PASSWORD=apppass

# Run Spring Boot
mvnw.cmd spring-boot:run
```

**Backend will start on:** `http://localhost:8080`

**Check if running:**
```bash
curl http://localhost:8080/students/
```

#### **Step 3: Start AI Service (Flask)**

Open **Terminal 2:**
```bash
# Navigate to AI service
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system\ai-service

# Create virtual environment (first time only)
python -m venv venv

# Activate virtual environment
venv\Scripts\activate

# Install dependencies (first time only)
pip install -r requirements.txt

# Run Flask app
python app.py
```

**AI Service will start on:** `http://localhost:5000`

**Check if running:**
```bash
curl http://localhost:5000
```

#### **Step 4: Start Frontend (React)**

Open **Terminal 3:**
```bash
# Navigate to frontend
cd c:\Users\Utkarsh\Downloads\attendance-system\attendance-system\attendance-frontend

# Install dependencies (first time only)
npm install

# Start on port 3001 (to avoid Grafana conflict)
set PORT=3001
npm start
```

**Frontend will start on:** `http://localhost:3001`

**Browser will auto-open, or visit:** `http://localhost:3001`

---

## ✅ Testing Checklist

### **1. Frontend UI Testing**

Visit `http://localhost:3001` and check:

- [ ] **Landing Page**
  - [ ] Hero section displays correctly
  - [ ] Smooth scroll animations work
  - [ ] "Choose Your Role" section appears on scroll

- [ ] **Student Role**
  - [ ] Click "Student" card
  - [ ] Toggle between "Sign In" and "Register" works
  - [ ] Registration form appears with all fields
  - [ ] Login form appears with username/password

- [ ] **Faculty Role**
  - [ ] Click "Faculty" card (redirects to `/faculty`)
  - [ ] Faculty login/register forms work
  - [ ] Toggle between forms works

- [ ] **Admin Role**
  - [ ] Click "Admin" card
  - [ ] Admin login form appears

- [ ] **Responsive Design**
  - [ ] Open DevTools (F12)
  - [ ] Toggle device toolbar (Ctrl+Shift+M)
  - [ ] Test on mobile, tablet, desktop sizes

### **2. Student Registration & Login**

- [ ] **Register a Test Student**
  ```
  Registration Number: TEST001
  Password: test123
  Name: Test Student
  Email: test@example.com
  Section: A
  ```
  - [ ] Upload a face image or use camera
  - [ ] Click "Register Your Face" button
  - [ ] Capture face image
  - [ ] Submit registration
  - [ ] Check for success message

- [ ] **Login as Student**
  ```
  Registration Number: TEST001
  Password: test123
  ```
  - [ ] Click "Sign In"
  - [ ] Should redirect to student dashboard
  - [ ] Profile card shows student details
  - [ ] "📷 Scan QR & Mark Attendance" button visible

### **3. QR Attendance Feature Testing**

This is your new feature! Test it thoroughly:

- [ ] **QR Scanner Modal**
  - [ ] Click "📷 Scan QR & Mark Attendance"
  - [ ] QR Scanner modal opens
  - [ ] Camera permission requested
  - [ ] Back camera activates
  - [ ] Scanner interface displays
  - [ ] "Cancel" button works

- [ ] **Face Capture Modal**
  - [ ] After scanning QR (or manually trigger)
  - [ ] Face Capture modal opens
  - [ ] Front camera activates
  - [ ] Face oval guide visible
  - [ ] Corner markers display
  - [ ] "Verify & Mark Attendance" button works
  - [ ] "Cancel" button works

- [ ] **Complete Flow**
  - [ ] Scan a faculty QR code
  - [ ] Face capture triggers automatically
  - [ ] Capture face image
  - [ ] AI recognizes face
  - [ ] Attendance marked successfully
  - [ ] Success message displays
  - [ ] Modal closes automatically
  - [ ] Attendance history updates

### **4. Faculty Features**

- [ ] **Faculty Registration**
  ```
  Faculty ID: FAC001
  Name: Test Faculty
  Email: faculty@example.com
  Department: Computer Science
  Password: faculty123
  ```

- [ ] **Faculty Login**
  - [ ] Login with faculty credentials
  - [ ] Dashboard displays

- [ ] **Create Session**
  - [ ] Click "Create New Session"
  - [ ] Fill session details:
    - Subject: Computer Science
    - Section: A
    - Date: Today
  - [ ] Submit
  - [ ] QR code generates
  - [ ] QR code refreshes every 4 seconds

- [ ] **Live Dashboard**
  - [ ] View real-time attendance
  - [ ] See student list
  - [ ] Monitor attendance count

### **5. Admin Features**

- [ ] **Admin Login**
  ```
  Username: admin
  Password: admin123
  ```

- [ ] **Admin Dashboard**
  - [ ] View all students
  - [ ] View all faculty
  - [ ] Delete student (test with dummy data)
  - [ ] Delete faculty (test with dummy data)
  - [ ] Logout button works

### **6. API Testing**

Use **Postman** or **curl** to test APIs:

#### **Test Student Login:**
```bash
curl -X POST http://localhost:8080/students/login ^
  -H "Content-Type: application/json" ^
  -d "{\"registrationNumber\":\"TEST001\",\"password\":\"test123\"}"
```

#### **Test Get Students:**
```bash
curl http://localhost:8080/students
```

#### **Test Face Recognition:**
```bash
curl -X POST http://localhost:5000/recognize-face ^
  -H "Content-Type: application/json" ^
  -d "{\"image\":\"base64_image_data_here\"}"
```

### **7. Database Testing**

Connect to MySQL and verify data:

```bash
# Connect to database
mysql -u appuser -papppass userdb

# Check tables
SHOW TABLES;

# Check students
SELECT * FROM student;

# Check faculty
SELECT * FROM faculty;

# Check attendance
SELECT * FROM attendance;

# Check sessions
SELECT * FROM attendance_session;

# Exit
exit;
```

### **8. Browser Console Testing**

Open DevTools Console (F12) and check for:

- [ ] No JavaScript errors
- [ ] No 404 errors
- [ ] No CORS errors
- [ ] API calls succeed (200 status)
- [ ] Console logs show expected data

### **9. Network Tab Testing**

Open DevTools Network tab and verify:

- [ ] API calls to `http://localhost:8080`
- [ ] AI service calls to `http://localhost:5000`
- [ ] All requests return 200 status
- [ ] Response data is correct
- [ ] No failed requests

### **10. Performance Testing**

- [ ] Page loads in < 3 seconds
- [ ] Animations are smooth (60fps)
- [ ] No memory leaks (check DevTools Memory)
- [ ] Camera starts quickly
- [ ] Face recognition is fast (< 2 seconds)

---

## 🐛 Common Issues & Solutions

### **Issue 1: Port Already in Use**

**Error:** `Port 3000 is already in use`

**Solution:**
```bash
# Use a different port
set PORT=3001
npm start
```

### **Issue 2: Backend Not Connecting to Database**

**Error:** `Communications link failure`

**Solution:**
```bash
# Check if MySQL is running
docker ps | grep mysql

# Start MySQL if not running
docker start attendance-mysql

# Or start persistent_db
docker start persistent_db
```

### **Issue 3: AI Service Not Starting**

**Error:** `ModuleNotFoundError: No module named 'face_recognition'`

**Solution:**
```bash
# Activate virtual environment
cd ai-service
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
```

### **Issue 4: Camera Not Working**

**Error:** `Camera access denied`

**Solution:**
- Allow camera permissions in browser
- Chrome: Settings → Privacy → Camera → Allow
- Use HTTPS or localhost (required for camera access)

### **Issue 5: CORS Errors**

**Error:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- Check SecurityConfig.java has correct origins
- Ensure backend is running on port 8080
- Frontend should call `http://localhost:8080/api/...`

### **Issue 6: Face Not Recognized**

**Error:** `Face not recognized`

**Solution:**
- Ensure face is registered first
- Check good lighting
- Face should be clearly visible
- Try re-registering face

---

## 📊 Test Data Setup

### **Create Test Users:**

#### **Students:**
```
1. Registration: TEST001, Password: test123, Section: A
2. Registration: TEST002, Password: test123, Section: A
3. Registration: TEST003, Password: test123, Section: B
```

#### **Faculty:**
```
1. Faculty ID: FAC001, Password: faculty123, Department: CS
2. Faculty ID: FAC002, Password: faculty123, Department: IT
```

#### **Admin:**
```
Username: admin, Password: admin123 (hardcoded)
```

---

## 🎯 Pre-Deployment Checklist

Before deploying to Vercel, ensure:

- [ ] All features work locally
- [ ] No console errors
- [ ] All API calls succeed
- [ ] Database is properly configured
- [ ] Environment variables are set
- [ ] Build succeeds (`npm run build`)
- [ ] Production build works (`serve -s build`)
- [ ] All tests pass
- [ ] Code is committed to Git
- [ ] README is updated
- [ ] Documentation is complete

---

## 🚀 Ready for Vercel?

Once all tests pass, you're ready to deploy! Check the **VERCEL_DEPLOYMENT_GUIDE.md** for deployment instructions.

---

## 📝 Testing Log Template

Use this to track your testing:

```
Date: ___________
Tester: ___________

Frontend UI: ✅ / ❌
Student Registration: ✅ / ❌
Student Login: ✅ / ❌
QR Scanner: ✅ / ❌
Face Capture: ✅ / ❌
Faculty Features: ✅ / ❌
Admin Features: ✅ / ❌
API Endpoints: ✅ / ❌
Database: ✅ / ❌
Performance: ✅ / ❌

Issues Found:
1. ___________
2. ___________
3. ___________

Notes:
___________
___________
```

---

**Happy Testing! 🎉**
