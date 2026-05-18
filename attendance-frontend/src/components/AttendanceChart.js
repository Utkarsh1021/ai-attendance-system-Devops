import React from "react";

import {
  Bar
} from "react-chartjs-2";

import {

  Chart as ChartJS,

  CategoryScale,

  LinearScale,

  BarElement,

  Title,

  Tooltip,

  Legend

} from "chart.js";

ChartJS.register(

  CategoryScale,

  LinearScale,

  BarElement,

  Title,

  Tooltip,

  Legend
);

function AttendanceChart({

  attendance

}) {

  // =========================
  // COUNT STUDENT ATTENDANCE
  // =========================

  const attendanceMap = {};

  attendance.forEach((record) => {

    const regNo =
      record.registrationNumber;

    if (
      attendanceMap[regNo]
    ) {

      attendanceMap[regNo]++;

    } else {

      attendanceMap[regNo] = 1;
    }
  });

  const labels =
    Object.keys(
      attendanceMap
    );

  const dataValues =
    Object.values(
      attendanceMap
    );

  const data = {

    labels,

    datasets: [

      {

        label:
          "Attendance Count",

        data:
          dataValues
      }
    ]
  };

  return (

    <div style={{
      width: "80%",
      margin: "30px auto"
    }}>

      <h2>
        Attendance Analytics
      </h2>

      <Bar data={data} />

    </div>
  );
}

export default AttendanceChart;