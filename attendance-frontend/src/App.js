import React, {
  useEffect,
  useState,
  useRef
} from "react";

import axios from "axios";

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
  // SIGNUP FUNCTION
  // =========================

  const handleSignup = async (e) => {

    e.preventDefault();

    try {

      const response =
        await axios.post(
          "http://localhost:8082/students/signup",
          signupData
        );

      console.log(
        response.data
      );

      setMessage(
        "Signup Successful"
      );

      fetchStudents();

      setSignupData({

        registrationNumber: "",
        password: "",
        name: "",
        email: "",
        section: ""

      });

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

  // =========================
  // UPLOAD FACE FUNCTION
  // =========================

  const uploadFace = async (
    capturedImage
  ) => {

    try {

      const response =
        await axios.post(

          "http://localhost:5000/register-face",

          {
            image:
              capturedImage,

            registrationNumber:
              loggedInStudent
                .registrationNumber
          }
        );

      console.log(
        response.data
      );

      setMessage(
        response.data.message
      );

    } catch (error) {

      console.error(error);

      setMessage(
        "Face Upload Failed"
      );
    }
  };

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

      setMessage(
        "Uploading Face..."
      );

      // =========================
      // REGISTER FACE
      // =========================

      await uploadFace(
        imageData
      );

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
                loggedInStudent.name
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

      console.error(error);

      setMessage(
        "Face Recognition Failed"
      );
    }
  };

  return (

    <div style={{
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <h1>
        AI Attendance System
      </h1>

      {
        !loggedInStudent && (

          <div>

            {/* =========================
                SIGNUP FORM
            ========================= */}

            <h2>
              Student Signup
            </h2>

            <form
              onSubmit={
                handleSignup
              }
            >

              <div style={{
                marginBottom:
                  "10px"
              }}>

                <input
                  type="text"
                  placeholder="Registration Number"
                  value={
                    signupData.registrationNumber
                  }
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      registrationNumber:
                        e.target.value
                    })
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <div style={{
                marginBottom:
                  "10px"
              }}>

                <input
                  type="password"
                  placeholder="Password"
                  value={
                    signupData.password
                  }
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      password:
                        e.target.value
                    })
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <div style={{
                marginBottom:
                  "10px"
              }}>

                <input
                  type="text"
                  placeholder="Name"
                  value={
                    signupData.name
                  }
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      name:
                        e.target.value
                    })
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <div style={{
                marginBottom:
                  "10px"
              }}>

                <input
                  type="email"
                  placeholder="Email"
                  value={
                    signupData.email
                  }
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      email:
                        e.target.value
                    })
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <div style={{
                marginBottom:
                  "10px"
              }}>

                <input
                  type="text"
                  placeholder="Section"
                  value={
                    signupData.section
                  }
                  onChange={(e) =>
                    setSignupData({
                      ...signupData,
                      section:
                        e.target.value
                    })
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <button
                type="submit"
                style={{
                  padding:
                    "10px 20px",
                  cursor:
                    "pointer"
                }}
              >
                Signup
              </button>

            </form>

            <hr />

            {/* =========================
                LOGIN FORM
            ========================= */}

            <h2>
              Student Login
            </h2>

            <form
              onSubmit={
                handleLogin
              }
            >

              <div style={{
                marginBottom:
                  "15px"
              }}>

                <input
                  type="text"
                  placeholder="Registration Number"
                  value={
                    registrationNumber
                  }
                  onChange={(e) =>
                    setRegistrationNumber(
                      e.target.value
                    )
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <div style={{
                marginBottom:
                  "15px"
              }}>

                <input
                  type="password"
                  placeholder="Password"
                  value={
                    password
                  }
                  onChange={(e) =>
                    setPassword(
                      e.target.value
                    )
                  }
                  style={{
                    padding:
                      "10px",
                    width:
                      "300px"
                  }}
                />

              </div>

              <button
                type="submit"
                style={{
                  padding:
                    "10px 20px",
                  cursor:
                    "pointer"
                }}
              >
                Login
              </button>

            </form>

          </div>
        )
      }

      <h3>{message}</h3>

      {
        loggedInStudent && (

          <div>

            <h2>
              Welcome {
                loggedInStudent.name
              }
            </h2>

            <p>
              Section:
              {" "}
              {
                loggedInStudent.section
              }
            </p>

            <p>
              Email:
              {" "}
              {
                loggedInStudent.email
              }
            </p>

            <button
              onClick={
                startCamera
              }
              style={{
                padding:
                  "10px",
                cursor:
                  "pointer",
                marginRight:
                  "10px"
              }}
            >
              Start Camera
            </button>

            <button
              onClick={
                handleLogout
              }
              style={{
                padding:
                  "10px",
                cursor:
                  "pointer",
                marginBottom:
                  "20px"
              }}
            >
              Logout
            </button>

            {
              cameraOn && (

                <div>

                  <video
                    ref={
                      videoRef
                    }
                    autoPlay
                    width="400"
                    style={{
                      marginTop:
                        "20px",
                      border:
                        "2px solid black"
                    }}
                  />

                  <br />

                  <button
                    onClick={
                      captureImage
                    }
                    style={{
                      padding:
                        "10px",
                      marginTop:
                        "15px",
                      cursor:
                        "pointer"
                    }}
                  >
                    Capture Face
                  </button>

                  {
                    image && (

                      <div>

                        <h3>
                          Captured Face
                        </h3>

                        <img
                          src={
                            image
                          }
                          alt="Captured"
                          width="300"
                          style={{
                            border:
                              "2px solid black",
                            marginTop:
                              "10px"
                          }}
                        />

                      </div>
                    )
                  }

                </div>
              )
            }

          </div>
        )
      }

      <hr />

      {/* =========================
          STUDENTS TABLE
      ========================= */}

      <h2>
        Students List
      </h2>

      <table
        border="1"
        cellPadding="10"
      >

        <thead>

          <tr>
            <th>ID</th>
            <th>
              Registration No
            </th>
            <th>Name</th>
            <th>Email</th>
            <th>Section</th>
            <th>
              Face Image
            </th>
          </tr>

        </thead>

        <tbody>

          {students.map(
            (student) => (

              <tr
                key={
                  student.id
                }
              >

                <td>
                  {student.id}
                </td>

                <td>
                  {
                    student.registrationNumber
                  }
                </td>

                <td>
                  {student.name}
                </td>

                <td>
                  {student.email}
                </td>

                <td>
                  {
                    student.section
                  }
                </td>

                <td>
                  {
                    student.faceEncodingPath
                  }
                </td>

              </tr>
            )
          )}

        </tbody>

      </table>

    </div>
  );
}

export default App;