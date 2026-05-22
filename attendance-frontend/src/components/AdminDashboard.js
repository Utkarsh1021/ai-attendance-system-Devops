import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AttendanceChart from "./AttendanceChart";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import "../styles/AdminDashboard.css";

function AdminDashboard() {
    const navigate = useNavigate();
    const [attendance, setAttendance] = useState([]);
    const [totalCount, setTotalCount] = useState(0);
    const [uniqueStudents, setUniqueStudents] = useState(0);
    const [message, setMessage] = useState("");
    const [students, setStudents] = useState([]);
    const [faculties, setFaculties] = useState([]);
    const [activeTab, setActiveTab] = useState('attendance');

    // Animation variants
    const fadeInUp = {
        hidden: { opacity: 0, y: 60 },
        visible: { 
            opacity: 1, 
            y: 0,
            transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] }
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

    const scaleIn = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: { 
            opacity: 1, 
            scale: 1,
            transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
        }
    };

    // Fetch attendance data
    const fetchAttendance = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8082/attendance",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            setAttendance(response.data);
            
            const unique = new Set(response.data.map(r => r.registrationNumber)).size;
            setUniqueStudents(unique);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch total count
    const fetchCount = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8082/attendance/count",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            setTotalCount(response.data);
        } catch (error) {
            console.error(error);
        }
    };

    // Fetch students
    const fetchStudents = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8082/students",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );
            setStudents(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch students");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Fetch faculties
    const fetchFaculties = async () => {
        try {
            const response = await axios.get(
                "http://localhost:8082/faculty",
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );
            setFaculties(response.data);
        } catch (error) {
            console.error(error);
            setMessage("Failed to fetch faculties");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Delete attendance record
    const deleteAttendance = async (id) => {
        if (!window.confirm("Are you sure you want to delete this attendance record?")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8082/attendance/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );

            fetchAttendance();
            fetchCount();
            setMessage("Record deleted successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete record");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Delete student
    const deleteStudent = async (id) => {
        if (!window.confirm("Are you sure you want to delete this student? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8082/students/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );
            fetchStudents();
            setMessage("Student deleted successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete student");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Delete faculty
    const deleteFaculty = async (id) => {
        if (!window.confirm("Are you sure you want to delete this faculty? This action cannot be undone.")) {
            return;
        }

        try {
            await axios.delete(
                `http://localhost:8082/faculty/${id}`,
                {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("adminToken")}`
                    }
                }
            );
            fetchFaculties();
            setMessage("Faculty deleted successfully");
            setTimeout(() => setMessage(""), 3000);
        } catch (error) {
            console.error(error);
            setMessage("Failed to delete faculty");
            setTimeout(() => setMessage(""), 3000);
        }
    };

    // Admin logout
    const handleLogout = () => {
        localStorage.removeItem("adminToken");
        setMessage("Logged out successfully");
        setTimeout(() => {
            window.location.href = '/?role=admin';
        }, 500);
    };

    // Export CSV
    const exportCSV = () => {
        let csvContent = "ID,Registration Number,Student Name,Date,Time,Status\n";

        attendance.forEach((record) => {
            csvContent += `${record.id},${record.registrationNumber},${record.studentName},${record.date},${record.time},${record.status}\n`;
        });

        const blob = new Blob([csvContent], { type: "text/csv" });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = "attendance.csv";
        a.click();

        setMessage("CSV exported successfully");
        setTimeout(() => setMessage(""), 3000);
    };

    // Export PDF
    const exportPDF = () => {
        const doc = new jsPDF();
        doc.text("Attendance Report", 20, 20);

        const tableColumn = ["ID", "Reg No", "Name", "Date", "Time", "Status"];
        const tableRows = [];

        attendance.forEach((record) => {
            const row = [
                record.id,
                record.registrationNumber,
                record.studentName,
                record.date,
                record.time,
                record.status
            ];
            tableRows.push(row);
        });

        autoTable(doc, {
            head: [tableColumn],
            body: tableRows
        });

        doc.save("attendance.pdf");

        setMessage("PDF exported successfully");
        setTimeout(() => setMessage(""), 3000);
    };

    // Load data on mount
    useEffect(() => {
        fetchAttendance();
        fetchCount();
        fetchStudents();
        fetchFaculties();
    }, []);

    return (
        <div className="admin-dashboard">
            {/* Navigation */}
            <motion.nav 
                className="admin-nav"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            >
                <div className="admin-nav__logo">Admin Portal</div>
                <div className="admin-nav__actions">
                    <div className="admin-nav__status">
                        <span className="admin-nav__status-dot"></span>
                        <span>
                            {activeTab === 'attendance' && `${attendance.length} Records`}
                            {activeTab === 'students' && `${students.length} Students`}
                            {activeTab === 'faculties' && `${faculties.length} Faculties`}
                        </span>
                    </div>
                    <motion.button
                        className="admin-nav__logout"
                        onClick={handleLogout}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                    >
                        Logout
                    </motion.button>
                </div>
            </motion.nav>

            {/* Hero Section */}
            <motion.section 
                className="admin-hero"
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
            >
                <motion.h1 className="admin-hero__title" variants={fadeInUp}>
                    {activeTab === 'attendance' && 'Attendance'}
                    {activeTab === 'students' && 'Student'}
                    {activeTab === 'faculties' && 'Faculty'}
                    <br />
                    <span className="admin-hero__accent">
                        {activeTab === 'attendance' && 'Analytics'}
                        {activeTab === 'students' && 'Management'}
                        {activeTab === 'faculties' && 'Management'}
                    </span>
                </motion.h1>
                <motion.p className="admin-hero__subtitle" variants={fadeInUp}>
                    {activeTab === 'attendance' && 'Comprehensive insights into student attendance patterns and trends'}
                    {activeTab === 'students' && 'Manage student accounts and registrations'}
                    {activeTab === 'faculties' && 'Manage faculty accounts and permissions'}
                </motion.p>

                {/* Tab Navigation */}
                <motion.div className="admin-tabs" variants={fadeInUp}>
                    <button
                        className={`admin-tab ${activeTab === 'attendance' ? 'admin-tab--active' : ''}`}
                        onClick={() => setActiveTab('attendance')}
                    >
                        Attendance
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'students' ? 'admin-tab--active' : ''}`}
                        onClick={() => setActiveTab('students')}
                    >
                        Students
                    </button>
                    <button
                        className={`admin-tab ${activeTab === 'faculties' ? 'admin-tab--active' : ''}`}
                        onClick={() => setActiveTab('faculties')}
                    >
                        Faculties
                    </button>
                </motion.div>
            </motion.section>

            {/* Message Display */}
            <AnimatePresence>
                {message && (
                    <motion.div
                        className="admin-message"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {message}
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Stats Grid - Only for Attendance Tab */}
            {activeTab === 'attendance' && (
                <motion.section 
                    className="admin-stats"
                    initial="hidden"
                    animate="visible"
                    variants={staggerContainer}
                >
                    <motion.div className="admin-stat-card" variants={scaleIn}>
                        <div className="admin-stat-card__value">{totalCount}</div>
                        <div className="admin-stat-card__label">Total Records</div>
                    </motion.div>

                    <motion.div className="admin-stat-card" variants={scaleIn}>
                        <div className="admin-stat-card__value">{uniqueStudents}</div>
                        <div className="admin-stat-card__label">Unique Students</div>
                    </motion.div>

                    <motion.div className="admin-stat-card" variants={scaleIn}>
                        <div className="admin-stat-card__value">
                            {totalCount > 0 ? (totalCount / uniqueStudents).toFixed(1) : '0'}
                        </div>
                        <div className="admin-stat-card__label">Avg Attendance</div>
                    </motion.div>
                </motion.section>
            )}

            {/* ATTENDANCE TAB CONTENT */}
            {activeTab === 'attendance' && (
                <>
                    {/* Chart Section */}
                    <motion.section 
                        className="admin-chart-section"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="admin-section-title">Attendance Trends</h2>
                        <div className="admin-chart-container">
                            <AttendanceChart attendance={attendance} />
                        </div>
                    </motion.section>

                    {/* Export Actions */}
                    <motion.section 
                        className="admin-actions"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                        variants={fadeInUp}
                    >
                        <h2 className="admin-section-title">Export Data</h2>
                        <div className="admin-actions__buttons">
                            <motion.button
                                className="btn btn--secondary"
                                onClick={exportCSV}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Export CSV
                            </motion.button>
                            <motion.button
                                className="btn btn--secondary"
                                onClick={exportPDF}
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                            >
                                Export PDF
                            </motion.button>
                        </div>
                    </motion.section>

                    {/* Attendance Table */}
                    <motion.section 
                        className="admin-table-section"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true, margin: "-100px" }}
                        variants={fadeInUp}
                    >
                        <h2 className="admin-section-title">Attendance Records</h2>
                        
                        {attendance.length === 0 ? (
                            <div className="admin-empty">
                                <div className="admin-empty__icon">📊</div>
                                <p className="admin-empty__text">No attendance records found</p>
                            </div>
                        ) : (
                            <div className="admin-table-container">
                                <table className="admin-table">
                                    <thead className="admin-table__head">
                                        <tr>
                                            <th className="admin-table__header">ID</th>
                                            <th className="admin-table__header">Registration No</th>
                                            <th className="admin-table__header">Student Name</th>
                                            <th className="admin-table__header">Date</th>
                                            <th className="admin-table__header">Time</th>
                                            <th className="admin-table__header">Status</th>
                                            <th className="admin-table__header">Attendance %</th>
                                            <th className="admin-table__header">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {attendance.map((record) => (
                                            <motion.tr
                                                key={record.id}
                                                className="admin-table__row"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
                                            >
                                                <td className="admin-table__cell">{record.id}</td>
                                                <td className="admin-table__cell admin-table__cell--highlight">
                                                    {record.registrationNumber}
                                                </td>
                                                <td className="admin-table__cell">{record.studentName}</td>
                                                <td className="admin-table__cell">{record.date}</td>
                                                <td className="admin-table__cell admin-table__cell--time">
                                                    {record.time}
                                                </td>
                                                <td className="admin-table__cell">
                                                    <span className="admin-status-badge">
                                                        {record.status}
                                                    </span>
                                                </td>
                                                <td className="admin-table__cell">
                                                    {(
                                                        (attendance.filter(
                                                            (a) => a.registrationNumber === record.registrationNumber
                                                        ).length / 30) * 100
                                                    ).toFixed(1)}%
                                                </td>
                                                <td className="admin-table__cell">
                                                    <motion.button
                                                        className="admin-delete-btn"
                                                        onClick={() => deleteAttendance(record.id)}
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        Delete
                                                    </motion.button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </motion.section>
                </>
            )}

            {/* STUDENTS TAB CONTENT */}
            {activeTab === 'students' && (
                <motion.section 
                    className="admin-table-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                >
                    <h2 className="admin-section-title">Student Management</h2>
                    
                    {students.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty__icon">👨‍🎓</div>
                            <p className="admin-empty__text">No students found</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table__head">
                                    <tr>
                                        <th className="admin-table__header">ID</th>
                                        <th className="admin-table__header">Name</th>
                                        <th className="admin-table__header">Email</th>
                                        <th className="admin-table__header">Registration No</th>
                                        <th className="admin-table__header">Section</th>
                                        <th className="admin-table__header">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student, index) => (
                                        <motion.tr
                                            key={student.id}
                                            className="admin-table__row"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ 
                                                duration: 0.4, 
                                                delay: index * 0.05,
                                                ease: [0.16, 1, 0.3, 1] 
                                            }}
                                        >
                                            <td className="admin-table__cell">{student.id}</td>
                                            <td className="admin-table__cell admin-table__cell--highlight">
                                                {student.name}
                                            </td>
                                            <td className="admin-table__cell">{student.email}</td>
                                            <td className="admin-table__cell admin-table__cell--time">
                                                {student.registrationNumber}
                                            </td>
                                            <td className="admin-table__cell">{student.section}</td>
                                            <td className="admin-table__cell">
                                                <motion.button
                                                    className="admin-delete-btn"
                                                    onClick={() => deleteStudent(student.id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.section>
            )}

            {/* FACULTIES TAB CONTENT */}
            {activeTab === 'faculties' && (
                <motion.section 
                    className="admin-table-section"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-100px" }}
                    variants={fadeInUp}
                >
                    <h2 className="admin-section-title">Faculty Management</h2>
                    
                    {faculties.length === 0 ? (
                        <div className="admin-empty">
                            <div className="admin-empty__icon">👨‍🏫</div>
                            <p className="admin-empty__text">No faculties found</p>
                        </div>
                    ) : (
                        <div className="admin-table-container">
                            <table className="admin-table">
                                <thead className="admin-table__head">
                                    <tr>
                                        <th className="admin-table__header">ID</th>
                                        <th className="admin-table__header">Name</th>
                                        <th className="admin-table__header">Email</th>
                                        <th className="admin-table__header">Faculty ID</th>
                                        <th className="admin-table__header">Department</th>
                                        <th className="admin-table__header">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {faculties.map((faculty, index) => (
                                        <motion.tr
                                            key={faculty.id}
                                            className="admin-table__row"
                                            initial={{ opacity: 0, x: -20 }}
                                            whileInView={{ opacity: 1, x: 0 }}
                                            viewport={{ once: true }}
                                            transition={{ 
                                                duration: 0.4, 
                                                delay: index * 0.05,
                                                ease: [0.16, 1, 0.3, 1] 
                                            }}
                                        >
                                            <td className="admin-table__cell">{faculty.id}</td>
                                            <td className="admin-table__cell admin-table__cell--highlight">
                                                {faculty.name}
                                            </td>
                                            <td className="admin-table__cell">{faculty.email}</td>
                                            <td className="admin-table__cell admin-table__cell--time">
                                                {faculty.facultyId}
                                            </td>
                                            <td className="admin-table__cell">{faculty.department}</td>
                                            <td className="admin-table__cell">
                                                <motion.button
                                                    className="admin-delete-btn"
                                                    onClick={() => deleteFaculty(faculty.id)}
                                                    whileHover={{ scale: 1.05 }}
                                                    whileTap={{ scale: 0.95 }}
                                                >
                                                    Delete
                                                </motion.button>
                                            </td>
                                        </motion.tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </motion.section>
            )}
        </div>
    );
}

export default AdminDashboard;
