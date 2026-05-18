package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.Attendance;
import com.utkarsh.attendance_system.repository.AttendanceRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@RestController
@RequestMapping("/attendance")

@CrossOrigin(origins = "*")

public class AttendanceController {

    @Autowired
    private AttendanceRepository attendanceRepository;

    // =========================
    // MARK ATTENDANCE
    // =========================

    @PostMapping("/mark")
    public Attendance markAttendance(
            @RequestBody Attendance attendance
    ) {

        attendance.setDate(LocalDate.now());

        attendance.setTime(LocalTime.now());

        attendance.setStatus("Present");

        return attendanceRepository.save(attendance);
    }

    // =========================
    // GET ALL ATTENDANCE
    // =========================

    @GetMapping
    public List<Attendance> getAttendance() {

        return attendanceRepository.findAll();
    }

    // =========================
    // GET ATTENDANCE BY ID
    // =========================

    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id
    ) {

        return attendanceRepository
                .findById(id)
                .orElse(null);
    }

    // =========================
    // GET ATTENDANCE BY STUDENT
    // =========================

    @GetMapping("/student/{registrationNumber}")
    public List<Attendance> getAttendanceByStudent(

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
    public List<Attendance> getAttendanceByDate(

            @PathVariable
            LocalDate date

    ) {

        return attendanceRepository
                .findByDate(date);
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
            @PathVariable Long id
    ) {

        attendanceRepository.deleteById(id);

        return "Attendance Deleted Successfully";
    }
}