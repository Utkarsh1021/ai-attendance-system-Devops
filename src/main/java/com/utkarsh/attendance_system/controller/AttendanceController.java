package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.Attendance;

import com.utkarsh.attendance_system.repository.AttendanceRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

import java.time.LocalTime;

import java.util.List;

import com.utkarsh.attendance_system.entity.Student;

import com.utkarsh.attendance_system.entity.AttendanceSession;

import com.utkarsh.attendance_system.repository.StudentRepository;

import com.utkarsh.attendance_system.repository.AttendanceSessionRepository;

@RestController

@RequestMapping("/api/attendance")

@CrossOrigin(origins = "*")

public class AttendanceController {

    @Autowired
    private AttendanceRepository
            attendanceRepository;

        @Autowired
        private StudentRepository
                studentRepository;

        @Autowired
        private AttendanceSessionRepository
                sessionRepository;
    // =========================
    // MARK ATTENDANCE
    // =========================

    @PostMapping("/mark")
    public Object markAttendance(

            @RequestBody
            Attendance attendance

    ) {

        // =========================
        // CURRENT DATE
        // =========================

        LocalDate today =
                LocalDate.now();


        // =========================
// FETCH STUDENT
// =========================

Student student =

        studentRepository
                .findByRegistrationNumber(

                        attendance
                                .getRegistrationNumber()
                );

// =========================
// STUDENT NOT FOUND
// =========================

if (student == null) {

    return "Student Not Found";
}

// =========================
// FETCH SESSION
// =========================

AttendanceSession session =

        sessionRepository
                .findBySessionId(

                        attendance
                                .getSessionId()
                )

                .orElse(null);

        // =========================
        // SESSION NOT FOUND
        // =========================

        if (session == null) {

                return "Invalid Session";
        }

        // =========================
        // SECTION VALIDATION
        // =========================

        if (

                !student.getSection()
                        .equalsIgnoreCase(

                                session.getSection()
                        )

        ) {

                return "You are not authorized for this section";
        }

        // =========================
        // CHECK DUPLICATE
        // SAME SESSION
        // =========================

        boolean alreadyMarked =

                attendanceRepository
                        .existsByRegistrationNumberAndSessionId(

                                attendance
                                        .getRegistrationNumber(),

                                attendance
                                        .getSessionId()
                        );

        // =========================
        // IF ALREADY MARKED
        // =========================

        if (alreadyMarked) {

            return "Attendance already marked for this session";
        }

        // =========================
        // SET DATE
        // =========================

        attendance.setDate(
                today
        );

        // =========================
        // SET TIME
        // =========================

        attendance.setTime(
                LocalTime.now()
        );

        // =========================
        // SET STATUS
        // =========================

        attendance.setStatus(
                "Present"
        );

        // =========================
        // SAVE ATTENDANCE
        // =========================

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================
    // GET ATTENDANCE BY STUDENT
    // =========================

//     @GetMapping("/student/{registrationNumber}")
//     public List<Attendance> getStudentAttendance(

//             @PathVariable
//             String registrationNumber

//     ) {

//         return attendanceRepository
//                 .findByRegistrationNumber(
//                         registrationNumber
//                 );
//     }

    // =========================
    // GET ALL ATTENDANCE
    // =========================

    @GetMapping
    public List<Attendance>
    getAttendance() {

        return attendanceRepository.findAll();
    }

    // =========================
    // GET ATTENDANCE BY ID
    // =========================

    @GetMapping("/{id}")
    public Attendance getAttendanceById(

            @PathVariable
            Long id

    ) {

        return attendanceRepository

                .findById(id)

                .orElse(null);
    }

    // =========================
    // GET ATTENDANCE BY STUDENT
    // =========================

    @GetMapping("/student/{registrationNumber}")
    public List<Attendance>
    getAttendanceByStudent(

            @PathVariable
            String registrationNumber

    ) {

        return attendanceRepository

                .findByRegistrationNumber(
                        registrationNumber
                );
    }

    // =========================
    // GET ATTENDANCE BY DATE
    // =========================

    @GetMapping("/date/{date}")
    public List<Attendance>
    getAttendanceByDate(

            @PathVariable
            LocalDate date

    ) {

        return attendanceRepository
                .findByDate(date);
    }

        // =========================
    // GET ATTENDANCE BY SESSION
    // =========================

    @GetMapping("/session/{sessionId}")
    public List<Attendance>
    getAttendanceBySession(

            @PathVariable
            String sessionId

    ) {

        return attendanceRepository
                .findBySessionId(
                        sessionId
                );
    }

        // =========================
    // MANUAL ATTENDANCE
    // =========================

    @PostMapping("/manual-mark")
    public Object manualMarkAttendance(

            @RequestBody
            Attendance attendance

    ) {

        // =========================
        // CHECK DUPLICATE
        // =========================

        boolean alreadyMarked =

                attendanceRepository
                        .existsByRegistrationNumberAndSessionId(

                                attendance
                                        .getRegistrationNumber(),

                                attendance
                                        .getSessionId()
                        );

        if (alreadyMarked) {

            return "Attendance already marked";
        }

        // =========================
        // SET VALUES
        // =========================

        attendance.setDate(
                LocalDate.now()
        );

        attendance.setTime(
                LocalTime.now()
        );

        attendance.setStatus(
                "Present"
        );

        return attendanceRepository.save(
                attendance
        );
    }

    // =========================
    // TOTAL ATTENDANCE COUNT
    // =========================

    @GetMapping("/count")
    public long getAttendanceCount() {

        return attendanceRepository.count();
    }

    // =========================
    // DELETE ATTENDANCE
    // =========================

    @DeleteMapping("/{id}")
    public String deleteAttendance(

            @PathVariable
            Long id

    ) {

        attendanceRepository
                .deleteById(id);

        return "Attendance Deleted Successfully";
    }
}