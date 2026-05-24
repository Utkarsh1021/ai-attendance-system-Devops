import React, { useEffect, useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "./App.css";
import AdminDashboard from "./components/AdminDashboard";
import FacultySession from "./components/FacultySession";
import FacultyLogin from "./components/FacultyLogin";
import {

    BrowserRouter,

    Routes,

    Route

} from "react-router-dom";

import MarkAttendancePage from "./components/MarkAttendancePage";

import FacultyRegister from "./components/FacultyRegister";

import FacultyAuth from "./components/FacultyAuth";

// Smooth scroll setup
if (typeof window !== 'undefined') {
  import('@studio-freight/lenis').then(({ default: Lenis }) => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });

    function raf(time) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);
  });
}

// Animation variants
const fadeInUp = {
  hidden: { opacity: 0, y: 60 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
  }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2
    }
  }
};

const scaleIn = {
  hidden: { opacity: 0, scale: 0.9 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
  }
};

function App() {

  // =========================
  // ROLE SELECTION STATE
  // =========================

  const [selectedRole, setSelectedRole] = useState(null); // 'student', 'faculty', 'admin', null

  // Check URL parameters for role selection
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const roleParam = urlParams.get('role');
    if (roleParam === 'admin' || roleParam === 'student') {
      setSelectedRole(roleParam);
    }
  }, []);

  // =========================
  // STUDENT AUTH MODE
  // =========================

  const [studentAuthMode, setStudentAuthMode] = useState('login'); // 'login' or 'register'

  // =========================
  // LOGIN STATES
  // =========================

  const [registrationNumber,
    setRegistrationNumber]
    = useState("");

  const [password,
    setPassword]
    = useState("");

  const [message,
    setMessage]
    = useState("");

  const [loggedInStudent,
    setLoggedInStudent]
    = useState(null);

  const [
    adminToken,
    setAdminToken
  ] = useState(

    localStorage.getItem(
      "adminToken"
    ) || ""
  );

  const [
    adminUsername,
    setAdminUsername
  ] = useState("");

  const [
    adminPassword,
    setAdminPassword
  ] = useState("");

  // =========================
  // SIGNUP STATES
  // =========================

  const [signupData,
    setSignupData] = useState({

      registrationNumber: "",
      password: "",
      name: "",
      email: "",
      section: ""

    });

  const [signupFace,
    setSignupFace] = useState(null);

  // =========================
  // STUDENT LIST
  // =========================

  const [students,
    setStudents]
    = useState([]);

  const [studentAttendance,
    setStudentAttendance]
    = useState([]);

  // =========================
  // CAMERA STATES
  // =========================

  const [cameraOn,
    setCameraOn]
    = useState(false);

  const [image,
    setImage]
    = useState(null);


  const [
    signupCameraOn,
    setSignupCameraOn
  ] = useState(false);

  const signupVideoRef =
  useRef(null);

  // =========================
  // VIDEO REF
  // =========================

  const videoRef =
    useRef(null);

  // =========================
  // FETCH STUDENTS
  // =========================

  useEffect(() => {

    const storedStudent =
      localStorage.getItem(
        "student"
      );

    if (storedStudent) {

      const student = JSON.parse(storedStudent);
      console.log('Stored student:', student);
      console.log('Registration number:', student.registrationNumber);
      setLoggedInStudent(student);
      
      // Fetch student's attendance history
      if (student.registrationNumber) {
        fetchStudentAttendance(student.registrationNumber);
      }
    }

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const response =
        await axios.get(
          "/api/students"
        );

      setStudents(
        response.data
      );

    } catch (error) {

      console.error(
        "Error fetching students:",
        error
      );
    }
  };

  const fetchStudentAttendance = async (registrationNumber) => {

    try {
      console.log(
        registrationNumber
      );


      const response =
        await axios.get(
          
          `/api/attendance/student/${registrationNumber}`
        );

      setStudentAttendance(
        response.data
      );

    } catch (error) {

      console.error(
        "Error fetching attendance:",
        error
      );
    }
  };

  // =========================
  // LOGIN FUNCTION
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

        const response =
            await axios.post(

                "/api/students/login",

                {
                    registrationNumber,
                    password
                }
            );

            console.log(
              response.data
            );

            // =========================
            // INVALID LOGIN
            // =========================

            if (

              response.data ===
              "Invalid Credentials"

            ) {

              setMessage(
                  "Invalid Credentials"
              );

              return;
            }

            // =========================
            // LOGIN SUCCESS
            // =========================

            console.log(
              response.data.registrationNumber
            );

            setMessage(

              "Login Successful Welcome "

              + response.data.name
            );

            setLoggedInStudent(
              response.data
            );

            localStorage.setItem(

              "student",

              JSON.stringify(
                  response.data
              )
            );

            // =========================
            // FETCH ATTENDANCE
            // =========================

            fetchStudentAttendance(

              response.data
                  .registrationNumber
            );

    } catch (error) {

        console.error(error);

        setMessage(
            "Login Failed"
        );
    }
  };


  // =========================
  // ADMIN LOGIN
  // =========================

  const handleAdminLogin =
    async (e) => {

      e.preventDefault();

      try {

        const response =
          await axios.post(

            "/api/auth/login",

            {

              username:
                adminUsername,

              password:
                adminPassword
            }
          );

        localStorage.setItem(

          "adminToken",

          response.data.token
        );

        setAdminToken(
          response.data.token
        );

        setMessage(
          "Admin Login Successful"
        );

      } catch (error) {

        console.error(error);

        setMessage(
          "Invalid Admin Credentials"
        );
      }
    };

  // =========================
  // SIGNUP FUNCTION
  // =========================

  const handleSignup = async (e) => {

    e.preventDefault();

    try {
      if (!signupFace) {

        setMessage(
          "Please upload or capture a face image"
        );
        return;
      }

    // =========================
    // SAVE STUDENT
    // =========================

      const response =
        await axios.post(

          "/api/students/signup",

          signupData
        );

      console.log(
        response.data
      );

      // =========================
      // REGISTER FACE
      // =========================

      await axios.post(

        "http://localhost:5000/register-face",

        {

          image:
            signupFace,

          registrationNumber:
            signupData.registrationNumber
        }
      );

      // =========================
      // SUCCESS MESSAGE
      // =========================

      setMessage(
        "Signup + Face Registration Successful"
      );

      fetchStudents();

      // =========================
      // RESET FORM
      // =========================

      setSignupData({

        registrationNumber: "",
        password: "",
        name: "",
        email: "",
        section: ""

      });

      setSignupFace(null);

    } catch (error) {

      console.error(error);

      setMessage(
        "Signup Failed"
      );
    }
  };

  // =========================
  // LOGOUT FUNCTION
  // =========================


  const handleAdminLogout =
  () => {

    localStorage.removeItem(
      "adminToken"
    );

    setAdminToken("");

    setMessage(
      "Admin Logged Out"
    );
  };

  const handleLogout = () => {

    localStorage.removeItem(
      "student"
    );

    setLoggedInStudent(
      null
    );

    setStudentAttendance([]);

    setMessage(
      "Logged Out"
    );
  };

  // =========================
  // START CAMERA
  // =========================

  const startCamera = async () => {

    try {

      setCameraOn(true);

      const stream =
        await navigator
          .mediaDevices
          .getUserMedia({
            video: true
          });

      setTimeout(() => {

        if (
          videoRef.current
        ) {

          videoRef.current.srcObject =
            stream;
        }

      }, 100);

    } catch (error) {

      console.error(error);

      setMessage(
        "Camera Access Denied"
      );
    }
  };

  const startSignupCamera = async () => {
    try {
      setSignupCameraOn(
        true
      );

      const stream =

        await navigator
          .mediaDevices
          .getUserMedia({

            video: true
          });

      setTimeout(() => {

        if (
          signupVideoRef.current
        ) {

          signupVideoRef.current.srcObject =
            stream;
        }

      }, 100);

    } catch (error) {

      console.error(error);

      setMessage(
        "Camera Access Denied"
      );
    }
  };


  const captureSignupFace =
  () => {

    try {

      const video =
        signupVideoRef.current;

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      const context =
        canvas.getContext(
          "2d"
        );

      context.drawImage(

        video,

        0,

        0,

        canvas.width,

        canvas.height
      );

      const imageData =
        canvas.toDataURL(
          "image/png"
        );

      setSignupFace(
        imageData
      );

      // =========================
      // STOP CAMERA STREAM
      // =========================

      const stream =
        video.srcObject;

      if (stream) {

        stream
          .getTracks()
          .forEach(track =>
            track.stop()
          );
      }

      video.srcObject =
        null;

      setSignupCameraOn(
        false
      );

      setMessage(
        "Face Captured Successfully"
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Face Capture Failed"
      );
    }
  };

  // =========================
  // UPLOAD FACE FUNCTION
  // =========================

  // const uploadFace = async (
  //   capturedImage
  // ) => {

  //   try {

  //     const response =
  //       await axios.post(

  //         "http://localhost:5000/register-face",

  //         {
  //           image:
  //             capturedImage,

  //           registrationNumber:
  //             loggedInStudent
  //               .registrationNumber
  //         }
  //       );

  //     console.log(
  //       response.data
  //     );

  //     setMessage(
  //       response.data.message
  //     );

  //   } catch (error) {

  //     console.error(error);

  //     setMessage(
  //       "Face Upload Failed"
  //     );
  //   }
  // };

  // =========================
  // CAPTURE + RECOGNIZE FACE
  // =========================

  const captureImage = async () => {

    try {

      const video =
        videoRef.current;

      const canvas =
        document.createElement(
          "canvas"
        );

      canvas.width =
        video.videoWidth;

      canvas.height =
        video.videoHeight;

      const context =
        canvas.getContext(
          "2d"
        );

      context.drawImage(
        video,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const imageData =
        canvas.toDataURL(
          "image/png"
        );

      setImage(
        imageData
      );

      

      // =========================
      // REGISTER FACE
      // =========================


      setMessage(
        "Recognizing Face..."
      );

      // =========================
      // RECOGNIZE FACE
      // =========================

      const recognizeResponse =
        await axios.post(

          "http://localhost:5000/recognize-face",

          {
            image: imageData
          }
        );

      console.log(
        recognizeResponse.data
      );

      // =========================
      // IF MATCH FOUND
      // =========================

      if (
        recognizeResponse.data.matched
      ) {

        const matchedRegistrationNumber =

          recognizeResponse.data
            .registrationNumber;

        // =========================
        // MARK ATTENDANCE
        // =========================

        const attendanceResponse =
          await axios.post(

            "/api/attendance/mark",

            {

              registrationNumber:
                matchedRegistrationNumber,

              studentName:
                matchedRegistrationNumber
            }
          );

        console.log(
          attendanceResponse.data
        );

        setMessage(
          "Attendance Marked Successfully"
        );

        alert(
          "Attendance Marked Successfully"
        );

      } else {

        setMessage(
          "Face Not Recognized"
        );

        alert(
          "Face Not Recognized"
        );
      }

    } catch (error) {
      console.error(
        error.response?.data
      );

      console.error(error);

      setMessage(
        "Face Recognition Failed"
      );
    }
  };

  return (
    <BrowserRouter>
    <Routes>

      {/* =========================
          FACULTY AUTH ROUTE
      ========================= */}
      <Route
        path="/faculty"
        element={<FacultyAuth />}
      />

      {/* =========================
          QR ATTENDANCE PAGE
      ========================= */}
      <Route
        path="/mark-attendance"
        element={<MarkAttendancePage />}
      />

      {/* =========================
          ADMIN DASHBOARD
      ========================= */}
      <Route
        path="/admin"
        element={<AdminDashboard />}
      />

      {/* =========================
          MAIN APP (STUDENT)
      ========================= */}
      <Route
        path="/"
        element={
    <>
      {/* Navigation */}
      <motion.nav 
        className="nav"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      >
        <div className="nav__logo">AI Attendance</div>
        {loggedInStudent ? (
          <div className="nav__status">
            <span className="nav__status-dot"></span>
            <span>{cameraOn ? 'Camera Active' : loggedInStudent.name}</span>
          </div>
        ) : (
          <div className="nav__status">
            <span className="nav__status-dot"></span>
            <span>{signupCameraOn ? 'Registering Face' : 'Student Portal'}</span>
          </div>
        )}
      </motion.nav>

      {/* Hero Section */}
      {!loggedInStudent && !adminToken && (
        <motion.section 
          className="hero"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          <motion.h1 className="hero__title" variants={fadeInUp}>
            Face The
            <br />
            <span className="hero__accent">Future</span>
          </motion.h1>
          <motion.p className="hero__subtitle" variants={fadeInUp}>
            Next-generation attendance powered by facial recognition AI.
            Secure, instant, effortless.
          </motion.p>
        </motion.section>
      )}

      {/* Role Selection Section - Appears on scroll */}
      {!loggedInStudent && !adminToken && !selectedRole && (
        <motion.section 
          className="role-selection"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="role-selection__title" variants={fadeInUp}>
            Choose Your
            <br />
            <span className="role-selection__accent">Role</span>
          </motion.h2>

          <motion.div className="role-cards" variants={staggerContainer}>
            <motion.div 
              className="role-card"
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('student')}
            >
              <div className="role-card__icon">👨‍🎓</div>
              <h3 className="role-card__title">Student</h3>
              <p className="role-card__description">
                Mark attendance using facial recognition
              </p>
            </motion.div>

            <motion.div 
              className="role-card"
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => window.location.href = '/faculty'}
            >
              <div className="role-card__icon">👨‍🏫</div>
              <h3 className="role-card__title">Faculty</h3>
              <p className="role-card__description">
                Create sessions and manage attendance
              </p>
            </motion.div>

            <motion.div 
              className="role-card"
              variants={scaleIn}
              whileHover={{ scale: 1.05, y: -10 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedRole('admin')}
            >
              <div className="role-card__icon">👨‍💼</div>
              <h3 className="role-card__title">Admin</h3>
              <p className="role-card__description">
                Manage system and view analytics
              </p>
            </motion.div>
          </motion.div>
        </motion.section>
      )}

      {/* Message Display */}
      <AnimatePresence>
        {message && (
          <motion.div
            className="message"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            style={{ 
              position: 'fixed', 
              top: '100px', 
              right: '8.33%', 
              zIndex: 1000,
              maxWidth: '400px'
            }}
          >
            {message}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Authentication Section - Student */}
      {!loggedInStudent && selectedRole === 'student' && (
        <section className="section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Back Button */}
            <motion.button
              className="btn btn--back"
              onClick={() => setSelectedRole(null)}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Role Selection
            </motion.button>

            {/* Toggle Between Login and Register */}
            <motion.div className="auth-toggle" variants={fadeInUp}>
              <button
                className={`auth-toggle__btn ${studentAuthMode === 'login' ? 'auth-toggle__btn--active' : ''}`}
                onClick={() => setStudentAuthMode('login')}
              >
                Sign In
              </button>
              <button
                className={`auth-toggle__btn ${studentAuthMode === 'register' ? 'auth-toggle__btn--active' : ''}`}
                onClick={() => setStudentAuthMode('register')}
              >
                Register
              </button>
            </motion.div>

            {/* Register Form */}
            {studentAuthMode === 'register' && (
              <motion.div 
                key="register-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="section__title">Create Account</h2>
                <p className="section__subtitle">
                  Register to access the AI-powered attendance system
                </p>

                <form className="form" onSubmit={handleSignup}>
                  <div className="form__group">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Registration Number"
                      value={signupData.registrationNumber}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          registrationNumber: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="password"
                      className="form__input"
                      placeholder="Password"
                      value={signupData.password}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          password: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Full Name"
                      value={signupData.name}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          name: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="email"
                      className="form__input"
                      placeholder="Email Address"
                      value={signupData.email}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          email: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Section"
                      value={signupData.section}
                      onChange={(e) =>
                        setSignupData({
                          ...signupData,
                          section: e.target.value
                        })
                      }
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="file"
                      accept="image/*"
                      className="form__input"
                      onChange={(e) => {
                        const file = 
                          e.target.files[0];
                        const reader =
                          new FileReader();
                        reader.onloadend = () => {
                          setSignupFace(
                            reader.result
                          );
                        };
                        if (file) {
                          reader.readAsDataURL(
                            file
                          );
                        }
                      }}
                    />
                  </div>

                  <motion.button
                    type="button"
                    className="btn btn--secondary"
                    onClick={startSignupCamera}
                    whileHover={{scale: 1.02}}
                    whileTap={{scale: 0.98}}
                  >
                    Register Your Face
                  </motion.button>

                  {signupCameraOn && (
                    <div className="camera">
                      <video
                        ref={signupVideoRef}
                        autoPlay
                        className="camera__video"
                      />
                      <motion.button
                        type="button"
                        className="btn btn--primary"
                        onClick={captureSignupFace}
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                      >
                        Capture Face
                      </motion.button>
                    </div>
                  )}

                  <motion.button
                    type="submit"
                    className="btn btn--primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Account
                  </motion.button>
                </form>
              </motion.div>
            )}

            {/* Login Form */}
            {studentAuthMode === 'login' && (
              <motion.div 
                key="login-form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
              >
                <h2 className="section__title">Sign In</h2>
                <p className="section__subtitle">
                  Access your account to mark attendance
                </p>

                <form className="form" onSubmit={handleLogin}>
                  <div className="form__group">
                    <input
                      type="text"
                      className="form__input"
                      placeholder="Registration Number"
                      value={registrationNumber}
                      onChange={(e) => setRegistrationNumber(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form__group">
                    <input
                      type="password"
                      className="form__input"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />
                  </div>

                  <motion.button
                    type="submit"
                    className="btn btn--primary"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Sign In
                  </motion.button>
                </form>
              </motion.div>
            )}
          </motion.div>
        </section>
      )}

      {/* Logged In Dashboard */}
      {loggedInStudent && (
        <motion.section 
          className="section"
          initial="hidden"
          animate="visible"
          variants={staggerContainer}
        >
          {/* Profile Card */}
          <motion.div className="profile" variants={scaleIn}>
            <h2 className="profile__name">{loggedInStudent.name}</h2>
            <div className="profile__detail">
              <span className="profile__label">Section:</span>
              <span>{loggedInStudent.section}</span>
            </div>
            <div className="profile__detail">
              <span className="profile__label">Email:</span>
              <span>{loggedInStudent.email}</span>
            </div>
            <div className="profile__detail">
              <span className="profile__label">Reg No:</span>
              <span>{loggedInStudent.registrationNumber}</span>
            </div>

            <div className="profile__actions">
              <motion.button
                className="btn btn--primary"
                onClick={startCamera}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {cameraOn ? 'Camera Active' : 'Start Camera'}
              </motion.button>
              <motion.button
                className="btn btn--secondary"
                onClick={handleLogout}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sign Out
              </motion.button>
            </div>
          </motion.div>

          {/* Camera Interface - Signature Moment */}
          <AnimatePresence>
            {cameraOn && (
              <motion.div
                className="camera"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="camera__viewport">
                  <video
                    ref={videoRef}
                    autoPlay
                    className="camera__video"
                  />
                  <div className="camera__overlay">
                    <div className="camera__frame"></div>
                    <div className="camera__corners">
                      <div className="camera__corner camera__corner--tl"></div>
                      <div className="camera__corner camera__corner--tr"></div>
                      <div className="camera__corner camera__corner--bl"></div>
                      <div className="camera__corner camera__corner--br"></div>
                    </div>
                  </div>
                </div>

                <div className="camera__controls">
                  <motion.button
                    className="btn btn--primary"
                    onClick={captureImage}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Capture & Verify Face
                  </motion.button>
                </div>

                <p className="camera__status">
                  Position your face within the frame for optimal recognition
                </p>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Captured Image Display */}
          <AnimatePresence>
            {image && (
              <motion.div
                className="capture"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              >
                <h3 className="capture__title">Captured Image</h3>
                <img
                  src={image}
                  alt="Captured face"
                  className="capture__image"
                />
              </motion.div>
            )}
          </AnimatePresence>

          {/* Student Attendance History */}
          <motion.div
            className="attendance-history"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeInUp}
          >
            <h2 className="section__title">My Attendance History</h2>
            <p className="section__subtitle">
              Total Present: {studentAttendance.length} days
            </p>

            {studentAttendance.length === 0 ? (
              <div className="attendance-history__empty">
                <p>No attendance records found</p>
              </div>
            ) : (
              <div className="table-container">
                <table className="table">
                  <thead className="table__head">
                    <tr>
                      <th className="table__header">Date</th>
                      <th className="table__header">Time</th>
                      <th className="table__header">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {studentAttendance.map((record, index) => (
                      <motion.tr
                        key={record.id}
                        className="table__row"
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ 
                          duration: 0.5,
                          delay: index * 0.05,
                          ease: [0.16, 1, 0.3, 1]
                        }}
                      >
                        <td className="table__cell">{record.date}</td>
                        <td className="table__cell">{record.time}</td>
                        <td className="table__cell">
                          <span className="status-badge status-badge--present">
                            {record.status}
                          </span>
                        </td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </motion.div>
        </motion.section>
      )}



      {/* =========================
          ADMIN AUTH SECTION
        ========================= */}

      {!adminToken && selectedRole === 'admin' && (
        <section className="section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={staggerContainer}
          >
            {/* Back Button */}
            <motion.button
              className="btn btn--back"
              onClick={() => setSelectedRole(null)}
              variants={fadeInUp}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              ← Back to Role Selection
            </motion.button>

            <motion.h2
              className="section__title"
              variants={fadeInUp}
            >
              Admin Access
            </motion.h2>

            <form
              className="form"
              onSubmit={handleAdminLogin}
            >
              <motion.div variants={fadeInUp}>
                <div className="form__group">
                  <input
                    type="text"
                    className="form__input"
                    placeholder="Admin Username"
                    value={adminUsername}
                    onChange={(e) =>
                      setAdminUsername(e.target.value)
                    }
                    required
                  />
                </div>

                <div className="form__group">
                  <input
                    type="password"
                    className="form__input"
                    placeholder="Admin Password"
                    value={adminPassword}
                    onChange={(e) =>
                      setAdminPassword(e.target.value)
                    }
                    required
                  />
                </div>

                <motion.button
                  type="submit"
                  className="btn btn--primary"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Admin Login
                </motion.button>
              </motion.div>
            </form>
          </motion.div>
        </section>
      )}

      {/* Admin Dashboard */}
      {adminToken && (
        <AdminDashboard />
      )}

      {/* Footer Section - Developer Info & Quotes */}
      {!loggedInStudent && !adminToken && (
        <motion.section 
          className="footer-section"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          {/* Inspirational Quote */}
          <motion.div className="footer-quote" variants={fadeInUp}>
            <p className="footer-quote__text">
              "The future belongs to those who believe in the beauty of their dreams."
            </p>
            <p className="footer-quote__author">— Eleanor Roosevelt</p>
          </motion.div>

          {/* Developer Section */}
          <motion.div className="footer-developer" variants={fadeInUp}>
            <h2 className="footer-developer__title">
              Built With
              <br />
              <span className="footer-developer__accent">Passion</span>
            </h2>
            
            <div className="footer-developer__content">
              <motion.div className="footer-developer__info" variants={scaleIn}>
                <h3 className="footer-developer__name">Utkarsh Raj</h3>
                <p className="footer-developer__role">Full Stack Developer</p>
                <p className="footer-developer__description">
                  Crafting innovative solutions with cutting-edge technology.
                  Passionate about AI, machine learning, and creating seamless user experiences.
                </p>
              </motion.div>

              <motion.div className="footer-developer__contact" variants={scaleIn}>
                <h4 className="footer-developer__contact-title">Let's Connect</h4>
                
                <motion.a
                  href="mailto:utkarshumang111@gmail.com"
                  className="footer-contact-btn"
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="footer-contact-btn__icon">✉</span>
                  <span className="footer-contact-btn__text">MAIL</span>
                </motion.a>

                <motion.a
                  href="mailto:https://www.linkedin.com/in/utkarshraj21/"
                  className="footer-contact-btn"
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="footer-contact-btn__icon"></span>
                  <span className="footer-contact-btn__text">Linkedin</span>
                </motion.a>

                <motion.a
                  href="sms:+1234567890"
                  className="footer-contact-btn"
                  whileHover={{ scale: 1.05, x: 10 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <span className="footer-contact-btn__icon">📱</span>
                  <span className="footer-contact-btn__text">Send a Message</span>
                </motion.a>
              </motion.div>
            </div>
          </motion.div>

          {/* Additional Quote */}
          <motion.div className="footer-quote footer-quote--secondary" variants={fadeInUp}>
            <p className="footer-quote__text">
              "Innovation distinguishes between a leader and a follower."
            </p>
            <p className="footer-quote__author">— Steve Jobs</p>
          </motion.div>

          {/* Copyright */}
          <motion.div className="footer-copyright" variants={fadeInUp}>
            <p>© 2026 Utkarsh Raj. All rights reserved.</p>
            <p className="footer-copyright__tagline">
              Powered by AI • Built with React & Spring Boot
            </p>
          </motion.div>
        </motion.section>
      )}
    </>
    }
    />

    </Routes>

  </BrowserRouter>
  );
}

export default App;