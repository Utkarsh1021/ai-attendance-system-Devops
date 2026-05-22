import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import FacultyLogin from "./FacultyLogin";
import FacultyRegister from "./FacultyRegister";
import "../styles/FacultyAuth.css";

const FacultyAuth = () => {
    const [isLogin, setIsLogin] = useState(true);

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const slideIn = {
        hidden: { opacity: 0, x: isLogin ? -40 : 40 },
        visible: { 
            opacity: 1, 
            x: 0,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        },
        exit: { 
            opacity: 0, 
            x: isLogin ? 40 : -40,
            transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <div className="faculty-auth">
            {/* Navigation */}
            <motion.nav 
                className="faculty-auth-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="faculty-auth-nav__logo">Faculty Portal</div>
                <div className="faculty-auth-nav__status">
                    <span className="faculty-auth-nav__status-dot"></span>
                    <span>{isLogin ? 'Sign In' : 'Register'}</span>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section 
                className="faculty-auth-hero"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <motion.h1 className="faculty-auth-hero__title" variants={fadeInUp}>
                    Faculty
                    <br />
                    <span className="faculty-auth-hero__accent">Access</span>
                </motion.h1>
                <motion.p className="faculty-auth-hero__subtitle" variants={fadeInUp}>
                    Secure authentication for faculty members to manage attendance sessions
                </motion.p>
            </motion.section>

            {/* Auth Toggle */}
            <motion.div 
                className="faculty-auth-toggle"
                initial="hidden"
                animate="visible"
                variants={fadeInUp}
            >
                <div className="faculty-auth-toggle__container">
                    <motion.button
                        className={`faculty-auth-toggle__btn ${isLogin ? 'faculty-auth-toggle__btn--active' : ''}`}
                        onClick={() => setIsLogin(true)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Sign In
                    </motion.button>
                    <motion.button
                        className={`faculty-auth-toggle__btn ${!isLogin ? 'faculty-auth-toggle__btn--active' : ''}`}
                        onClick={() => setIsLogin(false)}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                    >
                        Register
                    </motion.button>
                    <motion.div 
                        className="faculty-auth-toggle__slider"
                        animate={{ x: isLogin ? 0 : '100%' }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    />
                </div>
            </motion.div>

            {/* Auth Forms */}
            <div className="faculty-auth-content">
                <AnimatePresence mode="wait">
                    {isLogin ? (
                        <motion.div
                            key="login"
                            variants={slideIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <FacultyLogin />
                        </motion.div>
                    ) : (
                        <motion.div
                            key="register"
                            variants={slideIn}
                            initial="hidden"
                            animate="visible"
                            exit="exit"
                        >
                            <FacultyRegister />
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
};

export default FacultyAuth;