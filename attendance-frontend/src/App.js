import React, { useEffect, useState } from "react";
import axios from "axios";

function App() {

  const [students, setStudents] = useState([]);

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

      console.error("Error fetching students:", error);
    }
  };

  return (

    <div style={{ padding: "20px" }}>

      <h1>AI Attendance System</h1>

      <h2>Students List</h2>

      <table border="1" cellPadding="10">

        <thead>

          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Face Image</th>
          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr key={student.id}>

              <td>{student.id}</td>

              <td>{student.name}</td>

              <td>{student.email}</td>

              <td>{student.faceEncodingPath}</td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default App;