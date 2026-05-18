import React, {
  useEffect,
  useState
} from "react";

import axios from "axios";

import AttendanceChart
from "./AttendanceChart";

import jsPDF
from "jspdf";

import "jspdf-autotable";

function AdminDashboard() {

  // =========================
  // STATES
  // =========================

  const [
    attendance,
    setAttendance
  ] = useState([]);

  const [
    totalCount,
    setTotalCount
  ] = useState(0);

  // =========================
  // FETCH ATTENDANCE
  // =========================

  const fetchAttendance =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:8082/attendance"
          );

        setAttendance(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // FETCH TOTAL COUNT
  // =========================

  const fetchCount =
    async () => {

      try {

        const response =
          await axios.get(

            "http://localhost:8082/attendance/count"
          );

        setTotalCount(
          response.data
        );

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // DELETE ATTENDANCE
  // =========================

  const deleteAttendance =
    async (id) => {

      try {

        await axios.delete(

          `http://localhost:8082/attendance/${id}`
        );

        fetchAttendance();

        fetchCount();

      } catch (error) {

        console.error(error);
      }
    };

  // =========================
  // EXPORT CSV
  // =========================

  const exportCSV = () => {

    let csvContent =

      "ID,Registration Number,Student Name,Date,Time,Status\n";

    attendance.forEach((record) => {

      csvContent +=

        `${record.id},`

        + `${record.registrationNumber},`

        + `${record.studentName},`

        + `${record.date},`

        + `${record.time},`

        + `${record.status}\n`;
    });

    const blob = new Blob(

      [csvContent],

      {
        type: "text/csv"
      }
    );

    const url =
      window.URL.createObjectURL(
        blob
      );

    const a =
      document.createElement("a");

    a.href = url;

    a.download =
      "attendance.csv";

    a.click();
  };

  // =========================
  // EXPORT PDF
  // =========================

  const exportPDF = () => {

    const doc =
      new jsPDF();

    doc.text(
      "Attendance Report",
      20,
      20
    );

    const tableColumn = [

      "ID",

      "Reg No",

      "Name",

      "Date",

      "Time",

      "Status"
    ];

    const tableRows = [];

    attendance.forEach((record) => {

      const row = [

        record.id,

        record.registrationNumber,

        record.studentName,

        record.date,

        record.time,

        record.status
      ];

      tableRows.push(row);
    });

    doc.autoTable({

      head: [tableColumn],

      body: tableRows
    });

    doc.save(
      "attendance.pdf"
    );
  };

  // =========================
  // LOAD DATA
  // =========================

  useEffect(() => {

    fetchAttendance();

    fetchCount();

  }, []);

  return (

    <div style={{
      marginTop: "50px",
      padding: "20px"
    }}>

      <h1>
        Admin Dashboard
      </h1>

      {/* =========================
          TOTAL COUNT CARD
      ========================= */}

      <div style={{

        background: "#111",

        color: "white",

        padding: "20px",

        width: "300px",

        borderRadius: "10px",

        marginBottom: "30px"

      }}>

        <h2>
          Total Attendance
        </h2>

        <h1>
          {totalCount}
        </h1>

      </div>

      {/* =========================
          CHART
      ========================= */}

      <AttendanceChart
        attendance={attendance}
      />

      {/* =========================
          EXPORT BUTTONS
      ========================= */}

      <div style={{
        marginBottom: "20px"
      }}>

        <button

          onClick={exportCSV}

          style={{

            padding: "10px",

            cursor: "pointer",

            marginRight: "10px"
          }}
        >
          Export CSV
        </button>

        <button

          onClick={exportPDF}

          style={{

            padding: "10px",

            cursor: "pointer"
          }}
        >
          Export PDF
        </button>

      </div>

      {/* =========================
          ATTENDANCE TABLE
      ========================= */}

      <table
        border="1"
        cellPadding="10"
        style={{
          width: "100%",
          borderCollapse: "collapse"
        }}
      >

        <thead>

          <tr>

            <th>ID</th>

            <th>
              Registration Number
            </th>

            <th>
              Student Name
            </th>

            <th>Date</th>

            <th>Time</th>

            <th>Status</th>

            <th>
              Attendance %
            </th>

            <th>Action</th>

          </tr>

        </thead>

        <tbody>

          {
            attendance.map(
              (record) => (

                <tr key={record.id}>

                  <td>
                    {record.id}
                  </td>

                  <td>
                    {
                      record.registrationNumber
                    }
                  </td>

                  <td>
                    {
                      record.studentName
                    }
                  </td>

                  <td>
                    {record.date}
                  </td>

                  <td>
                    {record.time}
                  </td>

                  <td>
                    {record.status}
                  </td>

                  <td>

                    {(
                      (
                        attendance.filter(

                          (a) =>

                            a.registrationNumber ===
                            record.registrationNumber

                        ).length

                        / 30
                      ) * 100
                    ).toFixed(1)}%

                  </td>

                  <td>

                    <button

                      onClick={() =>
                        deleteAttendance(
                          record.id
                        )
                      }

                      style={{

                        background:
                          "red",

                        color:
                          "white",

                        border:
                          "none",

                        padding:
                          "8px",

                        cursor:
                          "pointer"
                      }}
                    >
                      Delete
                    </button>

                  </td>

                </tr>
              )
            )
          }

        </tbody>

      </table>

    </div>
  );
}

export default AdminDashboard;