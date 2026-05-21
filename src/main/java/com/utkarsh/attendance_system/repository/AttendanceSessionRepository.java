package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.AttendanceSession;

import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface AttendanceSessionRepository
        extends JpaRepository<
        AttendanceSession,
        Long
        > {

    Optional<AttendanceSession>
    findBySessionId(
            String sessionId
    );

    Optional<AttendanceSession>
    findBySessionIdAndQrToken(

            String sessionId,

            String qrToken
    );
}