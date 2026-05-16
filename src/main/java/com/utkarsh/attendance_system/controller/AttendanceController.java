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
}