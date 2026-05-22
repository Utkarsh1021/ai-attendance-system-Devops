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

      setLoggedInStudent(
        JSON.parse(
          storedStudent
        )
      );
    }

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const response =
        await axios.get(
          "http://localhost:8082/students"
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

  // =========================
  // LOGIN FUNCTION
  // =========================

  const handleLogin = async (e) => {

    e.preventDefault();

    try {

      const response =
        await axios.post(
          "http://localhost:8082/students/login",
          {
            registrationNumber,
            password
          }
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

    } catch (error) {

      console.error(error);

      setMessage(
        "Invalid Credentials"
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

            "http://localhost:8082/auth/login",

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

          "http://localhost:8082/students/signup",

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

            "http://localhost:8082/attendance/mark",

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
          QR ATTENDANCE PAGE
      ========================= */}

      <Route

        path="/mark-attendance"

        element={
          <MarkAttendancePage />
        }
      />

      {/* =========================
          MAIN APP
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
        {loggedInStudent && (
          <div className="nav__status">
            <span className="nav__status-dot"></span>
            <span>{loggedInStudent.name}</span>
          </div>
        )}
      </motion.nav>

      {/* Hero Section */}
      {!loggedInStudent && (
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

      {/* Authentication Section */}
      {!loggedInStudent && (
        <section className="section">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={staggerContainer}
          >
            {/* Signup Form */}
            <motion.div variants={fadeInUp}>
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
                  onClick={
                    startSignupCamera
                  }
                  whileHover={{scale: 1.02}}
                  whileTap={{scale: 0.98}}
                >Register Your Face
                </motion.button>

                {
                  signupCameraOn && (

                    <div
                      className="camera"
                    >

                      <video

                        ref={signupVideoRef}

                        autoPlay

                        className="camera__video"
                      />

                      <motion.button
                        type="button"
                        className="btn btn--primary"
                        onClick={
                          captureSignupFace
                        }
                        whileHover={{scale: 1.02}}
                        whileTap={{scale: 0.98}}
                      >
                        Capture Face
                      </motion.button>
                    </div>
                  )
                }

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

            <div className="divider"></div>

            {/* Login Form */}
            <motion.div variants={fadeInUp}>
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
        </motion.section>
      )}



      {/* =========================
          ADMIN AUTH SECTION
        ========================= */}

      <section className="section">

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{
          once: true
          }}
          variants={staggerContainer}
        >

          <motion.h2
            className="section__title"
            variants={fadeInUp}
          >
            Admin Access
          </motion.h2>

          {

            !adminToken ? (

              <form
                className="form"
                onSubmit={
                  handleAdminLogin
                }
              >

                <div className="form__group">

                  <input
                    type="text"

                    className="form__input"

                    placeholder="Admin Username"

                    value={adminUsername}

                    onChange={(e) =>
                      setAdminUsername(
                        e.target.value
                      )
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
                      setAdminPassword(
                        e.target.value
                      )
                    }

                    required
                  />

                </div>

                <motion.button

                  type="submit"

                  className="btn btn--primary"

                  whileHover={{
                    scale: 1.02
                  }}

                  whileTap={{
                    scale: 0.98
                  }}
                >
                  Admin Login
                </motion.button>

              </form>

            ) : (

              <div
                style={{
                  textAlign: "center"
                }}
              >

                <motion.button

                  className="btn btn--secondary"

                  onClick={
                    handleAdminLogout
                  }

                  whileHover={{
                    scale: 1.02
                  }}

                  whileTap={{
                    scale: 0.98
                  }}
                >
                  Admin Logout
                </motion.button>

              </div>
            )
          }

        </motion.div>

      </section>

      {/* Students List Section */}
      <section className="section section--compact">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={staggerContainer}
        >
          <motion.h2 className="section__title" variants={fadeInUp}>
            Registered Students
          </motion.h2>

          <motion.div className="table-container" variants={fadeInUp}>
            <table className="table">
              <thead className="table__head">
                <tr>
                  <th className="table__header">ID</th>
                  <th className="table__header">Registration No</th>
                  <th className="table__header">Name</th>
                  <th className="table__header">Email</th>
                  <th className="table__header">Section</th>
                  <th className="table__header">Face Data</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student, index) => (
                  <motion.tr
                    key={student.id}
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
                    <td className="table__cell">{student.id}</td>
                    <td className="table__cell">{student.registrationNumber}</td>
                    <td className="table__cell">{student.name}</td>
                    <td className="table__cell">{student.email}</td>
                    <td className="table__cell">{student.section}</td>
                    <td className="table__cell">
                      {student.faceEncodingPath ? '✓ Registered' : '— Pending'}
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </motion.div>
      </section>
      {
        adminToken && (
          <AdminDashboard />
        )
      }
      {/*<FacultyRegister />*/}
      {/*//<FacultyLogin />*/}
      <FacultyAuth />
    </>
    }
    />

    </Routes>

  </BrowserRouter>
  );
}

export default App;