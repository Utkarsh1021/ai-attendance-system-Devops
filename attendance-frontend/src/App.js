import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {

  // =========================
  // LOGIN STATES
  // =========================

  const [registrationNumber, setRegistrationNumber]
    = useState("");

  const [password, setPassword]
    = useState("");

  const [message, setMessage]
    = useState("");

  // =========================
  // STUDENT LIST STATE
  // =========================

  const [students, setStudents] = useState([]);

  // =========================
  // FETCH STUDENTS
  // =========================

  useEffect(() => {

    fetchStudents();

  }, []);

  const fetchStudents = async () => {

    try {

      const response = await axios.get(
        "http://localhost:8082/students"
      );

      setStudents(response.data);

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

      const response = await axios.post(
        "http://localhost:8082/students/login",
        {
          registrationNumber,
          password
        }
      );

      console.log(response.data);

      setMessage(
        "Login Successful Welcome "
        + response.data.name
      );

    } catch (error) {

      console.error(error);

      setMessage("Invalid Credentials");
    }
  };

  return (

    <div style={{
      padding: "30px",
      fontFamily: "Arial"
    }}>

      <h1>AI Attendance System</h1>

      {/* =========================
          LOGIN FORM
      ========================= */}

      <h2>Student Login</h2>

      <form onSubmit={handleLogin}>

        <div style={{ marginBottom: "15px" }}>

          <input
            type="text"
            placeholder="Registration Number"
            value={registrationNumber}
            onChange={(e) =>
              setRegistrationNumber(e.target.value)
            }
            style={{
              padding: "10px",
              width: "300px"
            }}
          />

        </div>

        <div style={{ marginBottom: "15px" }}>

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            style={{
              padding: "10px",
              width: "300px"
            }}
          />

        </div>

        <button
          type="submit"
          style={{
            padding: "10px 20px",
            cursor: "pointer"
          }}
        >
          Login
        </button>

      </form>

      <h3>{message}</h3>

      <hr />

      {/* =========================
          STUDENTS TABLE
      ========================= */}

      <h2>Students List</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>ID</th>
            <th>Registration No</th>
            <th>Name</th>
            <th>Email</th>
            <th>Section</th>
            <th>Face Image</th>
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.id}</td>

              <td>
                {student.registrationNumber}
              </td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>{student.section}</td>

              <td>
                {student.faceEncodingPath}
              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;