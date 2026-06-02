import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/FaceCaptureModal.css";

const FaceCaptureModal = ({ isOpen, onClose, sessionData, studentData }) => {
    const videoRef = useRef(null);
    const [isVerifying, setIsVerifying] = useState(false);
    const [verificationStatus, setVerificationStatus] = useState(null);
    const [message, setMessage] = useState("");
    const [cameraReady, setCameraReady] = useState(false);

    useEffect(() => {
        if (isOpen) {
            startCamera();
        }

        return () => {
            stopCamera();
        };
    }, [isOpen]);

    const startCamera = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: { facingMode: "user" }
            });

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
                videoRef.current.onloadedmetadata = () => {
                    setCameraReady(true);
                };
            }
        } catch (error) {
            console.error(error);
            setMessage("Camera access denied. Please enable camera permissions.");
            setVerificationStatus("error");
        }
    };

    const stopCamera = () => {
        if (videoRef.current && videoRef.current.srcObject) {
            const stream = videoRef.current.srcObject;
            stream.getTracks().forEach(track => track.stop());
            videoRef.current.srcObject = null;
        }
        setCameraReady(false);
    };

    const captureAndVerify = async () => {
        if (!cameraReady) {
            setMessage("Camera is not ready yet. Please wait...");
            return;
        }

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

            // Step 1: Recognize face
            setMessage("Recognizing face...");
            const recognizeResponse = await axios.post(
                "/api/face/recognize",
                { image: imageData }
            );

            if (!recognizeResponse.data.matched) {
                setMessage("Face not recognized. Please try again.");
                setVerificationStatus("error");
                setIsVerifying(false);
                return;
            }

            const recognizedRegNo = recognizeResponse.data.registrationNumber;

            // Verify it matches the logged-in student
            if (recognizedRegNo !== studentData.registrationNumber) {
                setMessage("Face does not match logged-in student. Please use your own account.");
                setVerificationStatus("error");
                setIsVerifying(false);
                return;
            }

            // Step 2: Mark attendance
            setMessage("Marking attendance...");
            const attendanceResponse = await axios.post(
                "/api/attendance/mark",
                {
                    registrationNumber: recognizedRegNo,
                    studentName: studentData.name,
                    sessionId: sessionData.sessionId,
                    token: sessionData.token
                }
            );

            if (typeof attendanceResponse.data === "string") {
                // Error message from backend
                setMessage(attendanceResponse.data);
                setVerificationStatus("error");
            } else {
                // Success
                setMessage("Attendance marked successfully! ✓");
                setVerificationStatus("success");
                
                // Close modal after 2 seconds
                setTimeout(() => {
                    stopCamera();
                    onClose(true); // Pass true to indicate success
                }, 2000);
            }
        } catch (error) {
            console.error(error);
            const errorMsg = error.response?.data?.message || error.response?.data || "Verification failed. Please try again.";
            setMessage(errorMsg);
            setVerificationStatus("error");
        } finally {
            setIsVerifying(false);
        }
    };

    const handleClose = () => {
        stopCamera();
        onClose(false);
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <motion.div
                className="face-modal-overlay"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClose}
            >
                <motion.div
                    className="face-modal"
                    initial={{ opacity: 0, scale: 0.9, y: 50 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 50 }}
                    transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="face-modal__header">
                        <h2 className="face-modal__title">Face Verification</h2>
                        <button 
                            className="face-modal__close" 
                            onClick={handleClose}
                            disabled={isVerifying}
                        >
                            ✕
                        </button>
                    </div>

                    <div className="face-modal__content">
                        <p className="face-modal__instruction">
                            Position your face within the frame for verification
                        </p>

                        <div className="face-modal__camera">
                            <div className="face-modal__viewport">
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    className="face-modal__video"
                                />
                                
                                {/* Face Oval Guide */}
                                <div className="face-modal__overlay">
                                    <div className="face-modal__frame"></div>
                                    <div className="face-modal__corners">
                                        <div className="face-modal__corner face-modal__corner--tl"></div>
                                        <div className="face-modal__corner face-modal__corner--tr"></div>
                                        <div className="face-modal__corner face-modal__corner--bl"></div>
                                        <div className="face-modal__corner face-modal__corner--br"></div>
                                    </div>
                                    
                                    {/* Scanning Line */}
                                    {isVerifying && (
                                        <motion.div 
                                            className="face-modal__scan-line"
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
                                            className={`face-modal__status face-modal__status--${verificationStatus}`}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.8 }}
                                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                        >
                                            <div className="face-modal__status-icon">
                                                {verificationStatus === 'success' ? '✓' : '✕'}
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </div>

                            {/* Status Message */}
                            <AnimatePresence>
                                {message && (
                                    <motion.div
                                        className={`face-modal__message face-modal__message--${verificationStatus || 'info'}`}
                                        initial={{ opacity: 0, y: 20 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -20 }}
                                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                    >
                                        {message}
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="face-modal__footer">
                        <motion.button
                            className="btn btn--secondary"
                            onClick={handleClose}
                            disabled={isVerifying}
                            whileHover={!isVerifying ? { scale: 1.02 } : {}}
                            whileTap={!isVerifying ? { scale: 0.98 } : {}}
                        >
                            Cancel
                        </motion.button>
                        <motion.button
                            className={`btn btn--primary ${isVerifying ? 'btn--loading' : ''}`}
                            onClick={captureAndVerify}
                            disabled={isVerifying || !cameraReady}
                            whileHover={!isVerifying && cameraReady ? { scale: 1.02 } : {}}
                            whileTap={!isVerifying && cameraReady ? { scale: 0.98 } : {}}
                        >
                            {isVerifying ? 'Verifying...' : 'Verify & Mark Attendance'}
                        </motion.button>
                    </div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
};

export default FaceCaptureModal;
