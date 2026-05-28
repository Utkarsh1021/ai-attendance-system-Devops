# QR Attendance Feature - Installation Guide 🚀

## 📦 What Was Implemented

### **Complete QR-based attendance system with:**
- ✅ QR code scanning using back camera
- ✅ Face recognition using front camera (single image)
- ✅ Automatic attendance marking
- ✅ Beautiful modal UI with animations
- ✅ Mobile-first responsive design
- ✅ Error handling and validation
- ✅ Real-time status updates

---

## 📁 Files Created/Modified

### **NEW FILES:**
1. `attendance-frontend/src/components/QRScannerModal.js` - QR scanning component
2. `attendance-frontend/src/components/FaceCaptureModal.js` - Face capture component
3. `attendance-frontend/src/styles/QRScannerModal.css` - QR scanner styling
4. `attendance-frontend/src/styles/FaceCaptureModal.css` - Face capture styling
5. `QR_ATTENDANCE_IMPLEMENTATION.md` - Complete implementation documentation
6. `HOW_TO_USE_QR_ATTENDANCE.md` - User guide
7. `INSTALLATION_GUIDE.md` - This file

### **MODIFIED FILES:**
1. `attendance-frontend/package.json` - Added dependencies
2. `attendance-frontend/src/App.js` - Added QR scanning flow
3. `attendance-frontend/src/App.css` - Enhanced button styling

---

## 🔧 Installation Steps

### **Step 1: Install Dependencies**

Navigate to the frontend directory:
```bash
cd attendance-frontend
```

Install the new packages:
```bash
npm install
```

This will install:
- `html5-qrcode@^2.3.8` - QR code scanning library
- `react-webcam@^7.1.1` - Camera access library

### **Step 2: Verify Installation**

Check if dependencies are installed:
```bash
npm list html5-qrcode react-webcam
```

Expected output:
```
attendance-frontend@0.1.0
├── html5-qrcode@2.3.8
└── react-webcam@7.1.1
```

### **Step 3: Start the Application**

#### **Option A: Using Docker (Recommended)**

From the project root:
```bash
docker-compose up -d
```

This will start:
- Backend (Spring Boot)
- Frontend (React)
- MySQL (persistent_db)
- AI Service (Python/Flask)
- Nginx (Reverse Proxy)

#### **Option B: Development Mode**

Start backend:
```bash
# Terminal 1
cd attendance-system
./mvnw spring-boot:run
```

Start AI service:
```bash
# Terminal 2
cd ai-service
python app.py
```

Start frontend:
```bash
# Terminal 3
cd attendance-frontend
npm start
```

### **Step 4: Verify Everything is Running**

Check if all services are up:
```bash
docker ps
```

Expected containers:
- `attendance-backend`
- `attendance-frontend`
- `attendance-nginx`
- `persistent_db`
- `ai-service` (if using Docker)

### **Step 5: Access the Application**

Open your browser and go to:
```
http://localhost
```

Or if running in development mode:
```
http://localhost:3000
```

---

## ✅ Testing the Feature

### **Quick Test:**

1. **Login as Student:**
   - Go to homepage
   - Click "Student" role
   - Login with credentials

2. **Test QR Scanning:**
   - Click "📷 Scan QR & Mark Attendance"
   - QR Scanner modal should open
   - Back camera should activate

3. **Test Face Capture:**
   - Scan a valid QR code (or click cancel for now)
   - Face Capture modal should open
   - Front camera should activate

4. **Verify UI:**
   - Check if modals are responsive
   - Check if animations work
   - Check if buttons are clickable

---

## 🔍 Troubleshooting

### **Problem: npm install fails**

**Solution:**
```bash
# Clear npm cache
npm cache clean --force

# Delete node_modules and package-lock.json
rm -rf node_modules package-lock.json

# Reinstall
npm install
```

### **Problem: Camera not working**

**Solution:**
- Check browser permissions
- Use HTTPS or localhost (required for camera access)
- Try a different browser
- Check if camera is being used by another app

### **Problem: QR Scanner not detecting codes**

**Solution:**
- Ensure good lighting
- Hold phone steady
- Try moving closer/farther
- Check if QR code is valid

### **Problem: Face recognition fails**

**Solution:**
- Check if AI service is running
- Verify AI service URL in code
- Check if face is registered in database
- Ensure good lighting for face capture

### **Problem: "Module not found" error**

**Solution:**
```bash
# Make sure you're in the right directory
cd attendance-frontend

# Install dependencies
npm install

# If still failing, check package.json
cat package.json
```

### **Problem: Docker containers not starting**

**Solution:**
```bash
# Check logs
docker-compose logs

# Restart containers
docker-compose down
docker-compose up -d

# Check if persistent_db is running
docker ps | grep persistent_db
```

---

## 🗄️ Database Configuration

### **Current Setup:**
- Database: `persistent_db` (external Docker network)
- Network: `persistent-demo_default`
- Connection: `jdbc:mysql://persistent_db:3306/userdb`

### **Verify Database Connection:**

```bash
# Connect to database
docker exec -it persistent_db mysql -u appuser -papppass userdb

# Check tables
SHOW TABLES;

# Check student data
SELECT COUNT(*) FROM student;

# Exit
exit
```

---

## 📱 Browser Compatibility

### **Supported Browsers:**
- ✅ Chrome 90+ (Recommended)
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

### **Required Features:**
- Camera API (getUserMedia)
- ES6+ JavaScript
- CSS Grid and Flexbox
- WebRTC

---

## 🔐 Security Checklist

### **Before Deployment:**
- [ ] Change default admin credentials
- [ ] Enable HTTPS
- [ ] Configure CORS properly
- [ ] Set up rate limiting
- [ ] Enable authentication tokens
- [ ] Configure session timeouts
- [ ] Set up logging and monitoring
- [ ] Backup database regularly

---

## 📊 Performance Optimization

### **Frontend:**
- Code splitting enabled (React)
- Lazy loading for modals
- Optimized images
- Minified CSS/JS in production

### **Backend:**
- Database connection pooling
- Caching for frequent queries
- Optimized API endpoints

### **AI Service:**
- Face encoding caching
- Optimized image processing
- Batch processing support

---

## 🚀 Deployment

### **Production Checklist:**

1. **Build Frontend:**
```bash
cd attendance-frontend
npm run build
```

2. **Update Docker Compose:**
```yaml
frontend:
  build:
    context: ./attendance-frontend
  environment:
    - NODE_ENV=production
```

3. **Configure Nginx:**
- Enable HTTPS
- Set up SSL certificates
- Configure caching
- Enable gzip compression

4. **Database:**
- Backup existing data
- Run migrations if needed
- Set up automated backups

5. **Monitoring:**
- Set up logging
- Configure alerts
- Monitor performance
- Track errors

---

## 📚 Documentation

### **Available Guides:**
1. `QR_ATTENDANCE_IMPLEMENTATION.md` - Technical implementation details
2. `HOW_TO_USE_QR_ATTENDANCE.md` - User guide for students and faculty
3. `INSTALLATION_GUIDE.md` - This file

### **Code Documentation:**
- All components have inline comments
- Functions are documented
- Complex logic is explained

---

## 🆘 Support

### **Need Help?**

**Developer:**
- Name: Utkarsh Raj
- Email: utkarshumang111@gmail.com

**Resources:**
- GitHub Issues (if applicable)
- Documentation files
- Code comments

---

## ✨ Next Steps

### **After Installation:**

1. **Test the Feature:**
   - Login as student
   - Try scanning QR codes
   - Verify face recognition
   - Check attendance history

2. **Configure Settings:**
   - Update admin credentials
   - Configure email notifications (if needed)
   - Set up backup schedule

3. **Train Users:**
   - Share user guide with students
   - Train faculty on QR generation
   - Provide support contact

4. **Monitor:**
   - Check logs regularly
   - Monitor performance
   - Track usage statistics

---

## 🎉 Success!

If you've completed all steps, your QR-based attendance system is now ready to use!

**Key Features:**
- ✅ QR code scanning
- ✅ Face recognition
- ✅ Automatic attendance marking
- ✅ Real-time updates
- ✅ Mobile-friendly
- ✅ Secure and validated

**Enjoy your new attendance system!** 🚀
