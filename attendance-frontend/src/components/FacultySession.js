import React,
{
    useState
} from "react";

import axios from "axios";

import QRCode from "react-qr-code";

import FacultyLiveDashboard from "./FacultyLiveDashboard";

import {

    useEffect

} from "react";

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

    const [

        sessionExpired,

        setSessionExpired

    ] = useState(false);


    useEffect(() => {

        if (!session?.sessionId)
            return;

        const interval =

            setInterval(

                async () => {

                    try {

                        const response =

                            await axios.get(

                                `http://localhost:8082/session/refresh-token?sessionId=${session.sessionId}`
                            );

                            // =========================
                            // SESSION EXPIRED
                            // =========================

                            if (

                                response.data ===
                                    "Session Expired"

                            ) {

                                setSessionExpired(
                                    true
                            );

                            clearInterval(
                                interval
                            );

                            return;
                        }

                        // =========================
                        // UPDATE TOKEN
                        // =========================

                        setSession(

                            prev => ({

                                ...prev,

                                qrToken:
                                    response.data.qrToken
                            })
                        );

                    } catch (error) {

                        console.error(
                            error
                        );
                    }
                },

                4000
            );

        return () =>
            clearInterval(
                interval
            );

    }, [session?.sessionId]);

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

                        {

    sessionExpired && (

        <h2
            style={{
                color: "red"
            }}
        >

            Session Expired

        </h2>
    )
}

{

    !sessionExpired && (

        <QRCode

            value={

                `http://localhost:3000/mark-attendance?sessionId=${session.sessionId}&token=${session.qrToken}`
            }
        />
    )
}

    

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
            {

                session && (

                    <FacultyLiveDashboard

                        sessionId={
                            session.sessionId
                        }
                    />
                )
            }
        </div>
    );
};

export default FacultySession;