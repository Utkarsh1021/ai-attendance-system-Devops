package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.Attendance;

import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;

import java.util.List;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

    List<Attendance>
    findByRegistrationNumber(
            String registrationNumber
    );

    List<Attendance>
    findByDate(
            LocalDate date
    );

    boolean existsByRegistrationNumberAndDate(

            String registrationNumber,

            LocalDate date
    );

    // =========================
    // SESSION ATTENDANCE CHECK
    // =========================

    boolean existsByRegistrationNumberAndSessionId(

            String registrationNumber,

            String sessionId
    );
}