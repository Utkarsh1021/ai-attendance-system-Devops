import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import QRCode from "react-qr-code";
import FacultyLiveDashboard from "./FacultyLiveDashboard";
import "../styles/FacultySession.css";

const FacultySession = () => {
    const [subject, setSubject] = useState("");
    const [section, setSection] = useState("");
    const [facultyName, setFacultyName] = useState("");
    const [session, setSession] = useState(null);
    const [sessionExpired, setSessionExpired] = useState(false);
    const [timeRemaining, setTimeRemaining] = useState(null);

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

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1,
                delayChildren: 0.2
            }
        }
    };

    // Token refresh effect
    useEffect(() => {
        if (!session?.sessionId) return;

        const interval = setInterval(async () => {
            try {
                const token = localStorage.getItem("facultyToken");
                const response = await axios.get(
                    `/api/session/refresh-token?sessionId=${session.sessionId}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (response.data === "Session Expired") {
                    setSessionExpired(true);
                    clearInterval(interval);
                    return;
                }

                setSession(prev => ({
                    ...prev,
                    qrToken: response.data.qrToken
                }));
            } catch (error) {
                console.error(error);
            }
        }, 4000); // Refresh token every 4 seconds for security

        return () => clearInterval(interval);
    }, [session?.sessionId]);

    // Countdown timer effect
    useEffect(() => {
        if (!session) return;
        
        // Use expiresAtMillis if available (epoch time), otherwise parse the string
        const expiryTime = session.expiresAtMillis || new Date(session.expiresAt).getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const remaining = expiryTime - now;
            
            // Debug logs (remove after testing)
            console.log('Current time (ms):', now);
            console.log('Expiry time (ms):', expiryTime);
            console.log('Time remaining (ms):', remaining);
            console.log('Time remaining (minutes):', (remaining / 1000 / 60).toFixed(2));

            if (remaining <= 0) {
                setTimeRemaining("00:00");
                setSessionExpired(true);
                clearInterval(interval);
            } else {
                const minutes = Math.floor((remaining % (1000 * 60 * 60)) / (1000 * 60));
                const seconds = Math.floor((remaining % (1000 * 60)) / 1000);
                setTimeRemaining(`${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`);
            }
        }, 1000);

        return () => clearInterval(interval);
    }, [session]);

    const createSession = async () => {
        try {
            const token = localStorage.getItem("facultyToken");
            const response = await axios.post(
                "/api/session/create",
                { subject, section, facultyName },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            setSession(response.data);
            setSessionExpired(false);
        } catch (error) {
            console.error(error);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("facultyToken");
        window.location.href = '/faculty';
    };

    return (
        <div className="faculty-session">
            {/* Navigation */}
            <motion.nav 
                className="faculty-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="faculty-nav__logo">Faculty Portal</div>
                <div className="faculty-nav__actions">
                    <div className="faculty-nav__status">
                        <span className="faculty-nav__status-dot"></span>
                        <span>{session ? 'Active Session' : 'Create Session'}</span>
                    </div>
                    <motion.button
                        className="faculty-nav__logout"
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Logout
                    </motion.button>
                </div>
            </motion.nav>

            {/* Hero Section - Session Creation */}
            {!session && (
                <motion.section 
                    className="faculty-hero"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.h1 className="faculty-hero__title" variants={fadeInUp}>
                        Start Your
                        <br />
                        <span className="faculty-hero__accent">Session</span>
                    </motion.h1>
                    <motion.p className="faculty-hero__subtitle" variants={fadeInUp}>
                        Create an attendance session and generate a secure QR code for your students
                    </motion.p>

                    <motion.div className="faculty-form" variants={fadeInUp}>
                        <div className="faculty-form__group">
                            <label className="faculty-form__label">Subject</label>
                            <input
                                type="text"
                                className="faculty-form__input"
                                placeholder="e.g., Data Structures"
                                value={subject}
                                onChange={(e) => setSubject(e.target.value)}
                            />
                        </div>

                        <div className="faculty-form__group">
                            <label className="faculty-form__label">Section</label>
                            <input
                                type="text"
                                className="faculty-form__input"
                                placeholder="e.g., CS-A"
                                value={section}
                                onChange={(e) => setSection(e.target.value)}
                            />
                        </div>

                        <div className="faculty-form__group">
                            <label className="faculty-form__label">Faculty Name</label>
                            <input
                                type="text"
                                className="faculty-form__input"
                                placeholder="Your name"
                                value={facultyName}
                                onChange={(e) => setFacultyName(e.target.value)}
                            />
                        </div>

                        <motion.button
                            className="btn btn--primary btn--large"
                            onClick={createSession}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            Launch Session
                        </motion.button>
                    </motion.div>
                </motion.section>
            )}

            {/* Active Session - Signature Moment */}
            <AnimatePresence>
                {session && (
                    <motion.section 
                        className="faculty-active"
                        initial="hidden"
                        animate="visible"
                        exit="hidden"
                        variants={staggerContainer}
                    >
                        {/* Session Header */}
                        <motion.div className="faculty-session-header" variants={fadeInUp}>
                            <div className="faculty-session-header__info">
                                <h2 className="faculty-session-header__title">{subject}</h2>
                                <p className="faculty-session-header__meta">
                                    Section {section} • {facultyName}
                                </p>
                            </div>
                            <div className="faculty-session-header__timer">
                                {sessionExpired ? (
                                    <motion.div 
                                        className="faculty-session-header__expired"
                                        initial={{ scale: 0.9 }}
                                        animate={{ scale: 1 }}
                                    >
                                        Session Expired
                                    </motion.div>
                                ) : (
                                    <>
                                        <div className="faculty-session-header__time">{timeRemaining}</div>
                                        <div className="faculty-session-header__label">Time Remaining</div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* QR Code Display - Signature Moment */}
                        <motion.div className="faculty-qr-container" variants={scaleIn}>
                            <div className="faculty-qr-card">
                                {sessionExpired ? (
                                    <div className="faculty-qr-expired">
                                        <div className="faculty-qr-expired__icon">⏱</div>
                                        <h3 className="faculty-qr-expired__title">Session Ended</h3>
                                        <p className="faculty-qr-expired__text">
                                            This session has expired. Create a new session to continue.
                                        </p>
                                        <motion.button
                                            className="btn btn--secondary"
                                            onClick={() => {
                                                setSession(null);
                                                setSubject("");
                                                setSection("");
                                                setFacultyName("");
                                            }}
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            Create New Session
                                        </motion.button>
                                    </div>
                                ) : (
                                    <>
                                        <div className="faculty-qr-card__header">
                                            <h3 className="faculty-qr-card__title">Scan to Mark Attendance</h3>
                                            <p className="faculty-qr-card__subtitle">
                                                Students scan this code to verify their presence
                                            </p>
                                        </div>
                                        <div className="faculty-qr-card__code">
                                            <motion.div
                                                className="faculty-qr-card__wrapper"
                                                initial={{ scale: 0.8, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <QRCode
                                                    value={`${window.location.origin}/mark-attendance?sessionId=${session.sessionId}&token=${session.qrToken}`}
                                                    size={280}
                                                    bgColor="#1a1a1a"
                                                    fgColor="#fafaf9"
                                                    level="H"
                                                />
                                            </motion.div>
                                        </div>
                                        <div className="faculty-qr-card__details">
                                            <div className="faculty-qr-card__detail">
                                                <span className="faculty-qr-card__detail-label">Session ID</span>
                                                <span className="faculty-qr-card__detail-value">{session.sessionId}</span>
                                            </div>
                                            <div className="faculty-qr-card__detail">
                                                <span className="faculty-qr-card__detail-label">Expires</span>
                                                <span className="faculty-qr-card__detail-value">
                                                    {new Date(session.expiresAt).toLocaleTimeString()}
                                                </span>
                                            </div>
                                        </div>
                                    </>
                                )}
                            </div>
                        </motion.div>

                        {/* Live Dashboard */}
                        {!sessionExpired && (
                            <motion.div variants={fadeInUp}>
                                <FacultyLiveDashboard sessionId={session.sessionId} />
                            </motion.div>
                        )}
                    </motion.section>
                )}
            </AnimatePresence>
        </div>
    );
};

export default FacultySession;