package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.Attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    // =========================
    // FIND BY REGISTRATION NUMBER
    // =========================

    List<Attendance> findByRegistrationNumber(
            String registrationNumber
    );

    // =========================
    // FIND BY DATE
    // =========================

    List<Attendance> findByDate(
            LocalDate date
    );
}