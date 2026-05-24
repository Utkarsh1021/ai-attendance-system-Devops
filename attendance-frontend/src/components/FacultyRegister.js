import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import FacultyLogin from "./FacultyLogin";
import "../styles/FacultyRegister.css";

const FacultyRegister = () => {
    const [facultyId, setFacultyId] = useState("");
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [department, setDepartment] = useState("");
    const [registered, setRegistered] = useState(false);
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

    const registerFaculty = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setMessage("");

        try {
            const response = await axios.post(
                "/api/faculty/register",
                {
                    facultyId,
                    name,
                    email,
                    password,
                    department
                }
            );

            if (response.data === "Faculty already exists") {
                setMessage("Faculty already exists. Please sign in instead.");
                setIsLoading(false);
                return;
            }

            setMessage("Registration successful! Redirecting to login...");
            
            setTimeout(() => {
                setRegistered(true);
            }, 1500);
        } catch (error) {
            console.error(error);
            setMessage("Registration failed. Please try again.");
            setIsLoading(false);
        }
    };

    if (registered) {
        return <FacultyLogin />;
    }

    return (
        <motion.div 
            className="faculty-register"
            initial="hidden"
            animate="visible"
            variants={fadeInUp}
        >
            <div className="faculty-register__card">
                <motion.div className="faculty-register__header" variants={fadeInUp}>
                    <h2 className="faculty-register__title">Create Account</h2>
                    <p className="faculty-register__subtitle">
                        Register as a faculty member to manage attendance
                    </p>
                </motion.div>

                <motion.form 
                    className="faculty-register__form"
                    onSubmit={registerFaculty}
                    variants={fadeInUp}
                >
                    <div className="faculty-register__form-row">
                        <div className="faculty-register__form-group">
                            <label className="faculty-register__label">Faculty ID</label>
                            <input
                                type="text"
                                className="faculty-register__input"
                                placeholder="FAC001"
                                value={facultyId}
                                onChange={(e) => setFacultyId(e.target.value)}
                                required
                            />
                        </div>

                        <div className="faculty-register__form-group">
                            <label className="faculty-register__label">Full Name</label>
                            <input
                                type="text"
                                className="faculty-register__input"
                                placeholder="Dr. John Doe"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="faculty-register__form-group">
                        <label className="faculty-register__label">Email Address</label>
                        <input
                            type="email"
                            className="faculty-register__input"
                            placeholder="faculty@university.edu"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>

                    <div className="faculty-register__form-row">
                        <div className="faculty-register__form-group">
                            <label className="faculty-register__label">Password</label>
                            <input
                                type="password"
                                className="faculty-register__input"
                                placeholder="Create a strong password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>

                        <div className="faculty-register__form-group">
                            <label className="faculty-register__label">Department</label>
                            <input
                                type="text"
                                className="faculty-register__input"
                                placeholder="Computer Science"
                                value={department}
                                onChange={(e) => setDepartment(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <motion.button
                        type="submit"
                        className={`btn btn--primary btn--large ${isLoading ? 'btn--loading' : ''}`}
                        disabled={isLoading}
                        whileHover={!isLoading ? { scale: 1.02 } : {}}
                        whileTap={!isLoading ? { scale: 0.98 } : {}}
                    >
                        {isLoading ? 'Creating Account...' : 'Create Account'}
                    </motion.button>
                </motion.form>

                <AnimatePresence>
                    {message && (
                        <motion.div
                            className={`faculty-register__message ${message.includes('successful') ? 'faculty-register__message--success' : 'faculty-register__message--error'}`}
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

export default FacultyRegister;