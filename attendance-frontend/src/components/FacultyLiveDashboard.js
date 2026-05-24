import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import "../styles/FacultyLiveDashboard.css";

const FacultyLiveDashboard = ({ sessionId }) => {
    const [attendance, setAttendance] = useState([]);
    const [registrationNumber, setRegistrationNumber] = useState("");
    const [studentName, setStudentName] = useState("");
    const [message, setMessage] = useState("");

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const listItem = {
        hidden: { opacity: 0, x: -20 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        }
    };

    // Fetch live attendance
    useEffect(() => {
        if (!sessionId) return;

        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                const response = await axios.get(
                    `/api/attendance/session/${sessionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setAttendance(response.data);
            } catch (error) {
                console.error(error);
            }
        }, 3000);

        return () => clearInterval(interval);
    }, [sessionId]);

    // Manual attendance marking
    const manualMarkAttendance = async () => {
        try {
            await axios.post(
                "/api/attendance/manual-mark",
                {
                    registrationNumber,
                    studentName,
                    sessionId
                }
            );

            setMessage("Attendance marked successfully");
            setRegistrationNumber("");
            setStudentName("");

            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to mark attendance");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    return (
        <div className="live-dashboard">
            {/* Stats Header */}
            <motion.div 
                className="live-dashboard__header"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <div className="live-dashboard__stat">
                    <div className="live-dashboard__stat-value">{attendance.length}</div>
                    <div className="live-dashboard__stat-label">Present Students</div>
                </div>
                <div className="live-dashboard__stat-indicator">
                    <span className="live-dashboard__pulse"></span>
                    <span className="live-dashboard__pulse-label">Live Updates</span>
                </div>
            </motion.div>

            {/* Manual Attendance Section */}
            <motion.div 
                className="live-dashboard__manual"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <h3 className="live-dashboard__section-title">Manual Entry</h3>
                <p className="live-dashboard__section-subtitle">
                    Mark attendance manually for students without QR access
                </p>

                <div className="live-dashboard__manual-form">
                    <div className="live-dashboard__form-row">
                        <input
                            type="text"
                            className="live-dashboard__input"
                            placeholder="Registration Number"
                            value={registrationNumber}
                            onChange={(e) => setRegistrationNumber(e.target.value)}
                        />
                        <input
                            type="text"
                            className="live-dashboard__input"
                            placeholder="Student Name"
                            value={studentName}
                            onChange={(e) => setStudentName(e.target.value)}
                        />
                    </div>
                    <motion.button
                        className="btn btn--primary"
                        onClick={manualMarkAttendance}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Mark Present
                    </motion.button>
                </div>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            className="live-dashboard__message"
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </motion.div>

            {/* Attendance List */}
            <motion.div 
                className="live-dashboard__list"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <h3 className="live-dashboard__section-title">Attendance Log</h3>
                
                {attendance.length === 0 ? (
                    <div className="live-dashboard__empty">
                        <div className="live-dashboard__empty-icon">📋</div>
                        <p className="live-dashboard__empty-text">
                            No students have marked attendance yet
                        </p>
                    </div>
                ) : (
                    <div className="live-dashboard__table-container">
                        <table className="live-dashboard__table">
                            <thead className="live-dashboard__table-head">
                                <tr>
                                    <th className="live-dashboard__table-header">#</th>
                                    <th className="live-dashboard__table-header">Registration No</th>
                                    <th className="live-dashboard__table-header">Student Name</th>
                                    <th className="live-dashboard__table-header">Time</th>
                                </tr>
                            </thead>
                            <tbody>
                                <AnimatePresence>
                                    {attendance.map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            className="live-dashboard__table-row"
                                            variants={listItem}
                                            initial="hidden"
                                            animate="visible"
                                            exit="hidden"
                                            layout
                                        >
                                            <td className="live-dashboard__table-cell">{index + 1}</td>
                                            <td className="live-dashboard__table-cell live-dashboard__table-cell--highlight">
                                                {student.registrationNumber}
                                            </td>
                                            <td className="live-dashboard__table-cell">{student.studentName}</td>
                                            <td className="live-dashboard__table-cell live-dashboard__table-cell--time">
                                                {student.time}
                                            </td>
                                        </motion.tr>
                                    ))}
                                </AnimatePresence>
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>
        </div>
    );
};

export default FacultyLiveDashboard;