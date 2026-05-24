import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import FacultySession from "./FacultySession";
import "../styles/FacultyLogin.css";

const FacultyLogin = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loggedIn, setLoggedIn] = useState(false);
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const loginFaculty = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                "/api/faculty/login",
                { email, password }
            );

            if (response.data === "Invalid Credentials") {
                setMessage("Invalid credentials. Please try again.");
                setIsLoading(false);
                return;
            }

            localStorage.setItem("facultyToken", response.data);
            setMessage("Login successful!");
            
            setTimeout(() => {
                setLoggedIn(true);
            }, 800);
        } catch (error) {
            console.error(error);
            setMessage("Login failed. Please check your credentials.");
            setIsLoading(false);
        }
    };

    if (loggedIn) {
        return <FacultySession />;
    }

    return (
        <motion.div 
            className="faculty-login"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <div className="faculty-login__card">
                <motion.div className="faculty-login__header" variants={fadeInUp}>
                    <h2 className="faculty-login__title">Welcome Back</h2>
                    <p className="faculty-login__subtitle">
                        Sign in to access your faculty dashboard
                    </p>
                </motion.div>

                <motion.form 
                    className="faculty-login__form"
                    onSubmit={loginFaculty}
                    variants={fadeInUp}
                >
                    <div className="faculty-login__form-group">
                        <label className="faculty-login__label">Email Address</label>
                        <input
                            type="email"
                            className="faculty-login__input"
                            placeholder="faculty@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="faculty-login__form-group">
                        <label className="faculty-login__label">Password</label>
                        <input
                            type="password"
                            className="faculty-login__input"
                            placeholder="Enter your password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>

                    <motion.button
                        type="submit"
                        className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                        {isLoading ? 'Signing In...' : 'Sign In'}
                    </motion.button>
                </motion.form>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`faculty-login__message ${message.includes('successful') ? 'faculty-login__message--success' : 'faculty-login__message--error'}`}
                            initial={{ opacity: 0, y: -10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {message}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </motion.div>
    );
};

export default FacultyLogin;