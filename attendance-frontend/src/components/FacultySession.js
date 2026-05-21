import React,
{
    useState
} from "react";

import axios from "axios";

import QRCode from "react-qr-code";

const FacultySession = () => {

    // =========================
    // STATES
    // =========================

    const [subject,
        setSubject] =
        useState("");

    const [section,
        setSection] =
        useState("");

    const [facultyName,
        setFacultyName] =
        useState("");

    const [session,
        setSession] =
        useState(null);

    // =========================
    // CREATE SESSION
    // =========================

    const createSession =
        async () => {

            try {

                const response =
                    await axios.post(

                        "http://localhost:8082/session/create",

                        {

                            subject,

                            section,

                            facultyName
                        }
                    );

                console.log(
                    response.data
                );

                setSession(
                    response.data
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

                padding: "30px"
            }}
        >

            <h1>
                Faculty Attendance Session
            </h1>

            {/* SUBJECT */}

            <input

                type="text"

                placeholder="Enter Subject"

                value={subject}

                onChange={(e) =>

                    setSubject(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            {/* SECTION */}

            <input

                type="text"

                placeholder="Enter Section"

                value={section}

                onChange={(e) =>

                    setSection(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            {/* FACULTY */}

            <input

                type="text"

                placeholder="Faculty Name"

                value={facultyName}

                onChange={(e) =>

                    setFacultyName(
                        e.target.value
                    )
                }
            />

            <br />
            <br />

            {/* CREATE BUTTON */}

            <button
                onClick={
                    createSession
                }
            >

                Start Attendance Session

            </button>

            {/* QR */}

            {

                session && (

                    <div
                        style={{
                            marginTop: "40px"
                        }}
                    >

                        <h2>
                            Scan QR For Attendance
                        </h2>

                        <QRCode

                            value={

                                `http://localhost:3000/mark-attendance?sessionId=${session.sessionId}&token=${session.qrToken}`
                            }
                        />

                        <br />
                        <br />

                        <p>

                            Session ID:

                            {
                                session.sessionId
                            }

                        </p>

                        <p>

                            Subject:

                            {
                                session.subject
                            }

                        </p>

                        <p>

                            Section:

                            {
                                session.section
                            }

                        </p>

                        <p>

                            Expires At:

                            {
                                session.expiresAt
                            }

                        </p>

                    </div>
                )
            }
        </div>
    );
};

export default FacultySession;