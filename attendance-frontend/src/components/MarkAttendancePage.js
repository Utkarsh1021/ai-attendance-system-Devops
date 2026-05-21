import React,
{
    useEffect,
    useRef,
    useState
}
from "react";

import {

    useSearchParams

} from "react-router-dom";

import axios from "axios";

const MarkAttendancePage = () => {

    // =========================
    // QUERY PARAMS
    // =========================

    const [searchParams] =
        useSearchParams();

    const sessionId =
        searchParams.get(
            "sessionId"
        );

    const token =
        searchParams.get(
            "token"
        );

    // =========================
    // STATES
    // =========================

    const [message,
        setMessage] =
        useState("");

    const videoRef =
        useRef(null);

    // =========================
    // START CAMERA
    // =========================

    useEffect(() => {

        startCamera();

    }, []);

    const startCamera =
        async () => {

            try {

                const stream =

                    await navigator
                        .mediaDevices
                        .getUserMedia({

                            video: true
                        });

                if (
                    videoRef.current
                ) {

                    videoRef.current.srcObject =
                        stream;
                }

            } catch (error) {

                console.error(
                    error
                );

                setMessage(
                    "Camera Access Denied"
                );
            }
        };

    // =========================
    // CAPTURE & VERIFY
    // =========================

    const captureAndVerify =
        async () => {

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

                // =========================
                // RECOGNIZE FACE
                // =========================

                const recognizeResponse =

                    await axios.post(

                        "http://localhost:5000/recognize-face",

                        {
                            image:
                                imageData
                        }
                    );

                // =========================
                // IF MATCHED
                // =========================

                if (

                    recognizeResponse
                        .data
                        .matched

                ) {

                    const registrationNumber =

                        recognizeResponse
                            .data
                            .registrationNumber;

                    // =========================
                    // MARK ATTENDANCE
                    // =========================

                    const attendanceResponse =

                        await axios.post(

                            "http://localhost:8082/attendance/mark",

                            {

                                registrationNumber,

                                studentName:
                                    registrationNumber,

                                sessionId,

                                token
                            }
                        );

                    console.log(
                        attendanceResponse.data
                    );
                    // =========================
                    // HANDLE STRING RESPONSES
                    // =========================

                    if (

                        typeof attendanceResponse.data
                        === "string"

                    ) {

                        setMessage(
                            attendanceResponse.data
                        );

                        alert(
                            attendanceResponse.data
                        );

                        return;
                    }

                    // =========================
                    // SUCCESS
                    // =========================

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
                }

            } catch (error) {

                console.error(
                    error
                );

                setMessage(
                    "Attendance Failed"
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
                Smart Attendance Verification
            </h1>

            <p>

                Session:

                {
                    sessionId
                }

            </p>

            <video

                ref={videoRef}

                autoPlay

                width="400"

            />

            <br />
            <br />

            <button

                onClick={
                    captureAndVerify
                }
            >

                Verify Face & Mark Attendance

            </button>

            <h2>
                {message}
            </h2>

        </div>
    );
};

export default MarkAttendancePage;