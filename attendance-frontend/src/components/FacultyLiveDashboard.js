import React,
{
    useEffect,
    useState
}
from "react";

import axios from "axios";

const FacultyLiveDashboard = (

    { sessionId }

) => {

    // =========================
    // STATES
    // =========================

    const [attendance,
        setAttendance] =
        useState([]);

    const [

        registrationNumber,
        setRegistrationNumber

    ] = useState("");

    const [

        studentName,
        setStudentName

    ] = useState("");

    // =========================
    // FETCH LIVE ATTENDANCE
    // =========================

    useEffect(() => {

        if (!sessionId)
            return;

        const interval =

            setInterval(

                async () => {

                    try {

                        const token =

                            localStorage.getItem(
                                "facultyToken"
                            );

                        const response =

                            await axios.get(

                                `http://localhost:8082/attendance/session/${sessionId}`,
                                {
                                    headers: {

                                        Authorization:
                                            `Bearer ${token}`
                                    }
                                }
                            );

                        setAttendance(
                            response.data
                        );

                    } catch (error) {

                        console.error(
                            error
                        );
                    }

                },

                3000
            );

        return () =>
            clearInterval(
                interval
            );

    }, [sessionId]);

    // =========================
    // MANUAL ATTENDANCE
    // =========================

    const manualMarkAttendance =
        async () => {

            try {

                const response =

                    await axios.post(

                        "http://localhost:8082/attendance/manual-mark",

                        {

                            registrationNumber,

                            studentName,

                            sessionId
                        }
                    );

                console.log(
                    response.data
                );

                alert(
                    "Attendance Marked Manually"
                );

                setRegistrationNumber(
                    ""
                );

                setStudentName(
                    ""
                );

            } catch (error) {

                console.error(
                    error
                );
            }
        };

    return (

        <div
            style={{
                marginTop: "40px"
            }}
        >

            <h2>
                Live Attendance Dashboard
            </h2>

            <h3>

                Present Students:

                {
                    attendance.length
                }

            </h3>

            {/* =========================
                MANUAL ATTENDANCE
            ========================= */}

            <h3>
                Manual Attendance
            </h3>

            <input

                type="text"

                placeholder="Registration Number"

                value={registrationNumber}

                onChange={(e) =>

                    setRegistrationNumber(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <input

                type="text"

                placeholder="Student Name"

                value={studentName}

                onChange={(e) =>

                    setStudentName(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            <button

                onClick={
                    manualMarkAttendance
                }
            >

                Mark Present

            </button>

            <br />
            <br />

            {/* =========================
                ATTENDANCE TABLE
            ========================= */}

            <table
                border="1"
                cellPadding="10"
            >

                <thead>

                    <tr>

                        <th>
                            Registration Number
                        </th>

                        <th>
                            Student Name
                        </th>

                        <th>
                            Time
                        </th>

                    </tr>

                </thead>

                <tbody>

                    {

                        attendance.map(

                            (student) => (

                                <tr
                                    key={
                                        student.id
                                    }
                                >

                                    <td>
                                        {
                                            student.registrationNumber
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.studentName
                                        }
                                    </td>

                                    <td>
                                        {
                                            student.time
                                        }
                                    </td>

                                </tr>
                            )
                        )
                    }

                </tbody>

            </table>

        </div>
    );
};

export default FacultyLiveDashboard;