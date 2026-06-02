import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSearchParams } from "react-router-dom";
import axios from "axios";
import "../styles/MarkAttendancePage.css";

const MarkAttendancePage = () => {
    const [searchParams] = useSearchParams();
    const sessionId = searchParams.get("sessionId");
    const token = searchParams.get("token");

    const [message, setMessage] = useState("");
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null); // 'success' | 'error' | null
    const videoRef = useRef(null);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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

    // Start camera on mount
    useEffect(() => {
        startCamera();
    }, []);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }
        } catch (error) {
            console.error(error);
            setMessage("Camera access denied. Please enable camera permissions.");
        }
    };

    const captureAndVerify = async () => {
        setIsVerifying(true);
        setVerificationStatus(null);
        setMessage("Analyzing face...");

        try {
            const video = videoRef.current;
            const canvas = document.createElement("canvas");
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;

            const context = canvas.getContext("2d");
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = canvas.toDataURL("image/png");

            // Recognize face
            const recognizeResponse = await axios.post(
                "/api/face/recognize",
                { image: imageData }
            );

            if (recognizeResponse.data.matched) {
                const registrationNumber = recognizeResponse.data.registrationNumber;

                // Mark attendance
                const attendanceResponse = await axios.post(
                    "/api/attendance/mark",
                    {
                        registrationNumber,
                        studentName: registrationNumber,
                        sessionId,
                        token
                    }
                );

                if (typeof attendanceResponse.data === "string") {
                    setMessage(attendanceResponse.data);
                    setVerificationStatus("error");
                } else {
                    setMessage("Attendance marked successfully!");
                    setVerificationStatus("success");
                }
            } else {
                setMessage("Face not recognized. Please try again.");
                setVerificationStatus("error");
            }
        } catch (error) {
            console.error(error);
            setMessage("Verification failed. Please try again.");
            setVerificationStatus("error");
        } finally {
            setIsVerifying(false);
        }
    };

    return (
        <div className="mark-attendance">
            {/* Navigation */}
            <motion.nav 
                className="mark-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="mark-nav__logo">AI Attendance</div>
                <div className="mark-nav__session">
                    {verificationStatus === 'success' ? 'Verified ✓' : 
                     verificationStatus === 'error' ? 'Verification Failed' : 
                     isVerifying ? 'Verifying...' : 
                     'Face Verification'}
                </div>
            </motion.nav>

            {/* Main Content */}
            <motion.section 
                className="mark-content"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <motion.h1 className="mark-title" variants={fadeInUp}>
                    Face
                    <br />
                    <span className="mark-title__accent">Verification</span>
                </motion.h1>

                <motion.p className="mark-subtitle" variants={fadeInUp}>
                    Position your face within the frame for instant recognition
                </motion.p>

                {/* Camera Interface - Signature Moment */}
                <motion.div className="mark-camera" variants={scaleIn}>
                    <div className="mark-camera__viewport">
                        <video
                            ref={videoRef}
                            autoPlay
                            playsInline
                            className="mark-camera__video"
                        />
                        
                        {/* Scanning Overlay */}
                        <div className="mark-camera__overlay">
                            <div className="mark-camera__frame"></div>
                            <div className="mark-camera__corners">
                                <div className="mark-camera__corner mark-camera__corner--tl"></div>
                                <div className="mark-camera__corner mark-camera__corner--tr"></div>
                                <div className="mark-camera__corner mark-camera__corner--bl"></div>
                                <div className="mark-camera__corner mark-camera__corner--br"></div>
                            </div>
                            
                            {/* Scanning Line */}
                            {isVerifying && (
                                <motion.div 
                                    className="mark-camera__scan-line"
                                    initial={{ top: "10%" }}
                                    animate={{ top: "90%" }}
                                    transition={{ 
                                        duration: 2, 
                                        repeat: Infinity, 
                                        ease: "linear" 
                                    }}
                                />
                            )}
                        </div>

                        {/* Verification Status Overlay */}
                        <AnimatePresence>
                            {verificationStatus && (
                                <motion.div 
                                    className={`mark-camera__status mark-camera__status--${verificationStatus}`}
                                    initial={{ opacity: 0, scale: 0.8 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    exit={{ opacity: 0, scale: 0.8 }}
                                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                >
                                    <div className="mark-camera__status-icon">
                                        {verificationStatus === 'success' ? '✓' : '✕'}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Controls */}
                    <div className="mark-camera__controls">
                        <motion.button
                            className={`btn btn--primary btn--large ${isVerifying ? 'btn--loading' : ''}`}
                            onClick={captureAndVerify}
                            disabled={isVerifying}
                            whileHover={!isVerifying ? { scale: 1.02 } : {}}
                            whileTap={!isVerifying ? { scale: 0.98 } : {}}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify & Mark Attendance'}
                        </motion.button>
                    </div>

                    {/* Status Message */}
                    <AnimatePresence>
                        {message && (
                            <motion.div
                                className={`mark-camera__message mark-camera__message--${verificationStatus || 'info'}`}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -20 }}
                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                            >
                                {message}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </motion.div>

                {/* Instructions */}
                <motion.div className="mark-instructions" variants={fadeInUp}>
                    <h3 className="mark-instructions__title">How it works</h3>
                    <div className="mark-instructions__grid">
                        <div className="mark-instructions__item">
                            <div className="mark-instructions__number">01</div>
                            <p className="mark-instructions__text">
                                Position your face within the circular frame
                            </p>
                        </div>
                        <div className="mark-instructions__item">
                            <div className="mark-instructions__number">02</div>
                            <p className="mark-instructions__text">
                                Click the verification button to capture
                            </p>
                        </div>
                        <div className="mark-instructions__item">
                            <div className="mark-instructions__number">03</div>
                            <p className="mark-instructions__text">
                                Wait for AI to verify and mark attendance
                            </p>
                        </div>
                    </div>
                </motion.div>
            </motion.section>
        </div>
    );
};

export default MarkAttendancePage;