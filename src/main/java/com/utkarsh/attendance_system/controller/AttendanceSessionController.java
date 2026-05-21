package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.AttendanceSession;

import com.utkarsh.attendance_system.repository.AttendanceSessionRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;

import java.util.UUID;

@RestController

@RequestMapping("/session")

@CrossOrigin(origins = "*")

public class AttendanceSessionController {

    @Autowired
    private AttendanceSessionRepository
            sessionRepository;

    // =========================
    // CREATE SESSION
    // =========================

    @PostMapping("/create")
    public AttendanceSession createSession(

            @RequestBody
            AttendanceSession session

    ) {

        // =========================
        // GENERATE SESSION ID
        // =========================

        session.setSessionId(

                UUID.randomUUID()
                        .toString()
        );

        // =========================
        // GENERATE QR TOKEN
        // =========================

        session.setQrToken(

                UUID.randomUUID()
                        .toString()
        );

        // =========================
        // SET CREATED TIME
        // =========================

        session.setCreatedAt(

                LocalDateTime.now()
        );

        // =========================
        // SET EXPIRY
        // =========================

        session.setExpiresAt(

                LocalDateTime.now()
                        .plusMinutes(2)
        );

        // =========================
        // ACTIVE SESSION
        // =========================

        session.setActive(true);

        return sessionRepository.save(
                session
        );
    }

    // =========================
    // VALIDATE SESSION
    // =========================

    @GetMapping("/validate")
    public Object validateSession(

            @RequestParam
            String sessionId,

            @RequestParam
            String token

    ) {

        // =========================
        // FIND SESSION
        // =========================

        var optionalSession =

                sessionRepository
                        .findBySessionIdAndQrToken(

                                sessionId,

                                token
                        );

        // =========================
        // INVALID SESSION
        // =========================

        if (

                optionalSession.isEmpty()

        ) {

            return "Invalid Session";
        }

        AttendanceSession session =

                optionalSession.get();

        // =========================
        // CHECK ACTIVE
        // =========================

        if (

                !session.isActive()

        ) {

            return "Session Expired";
        }

        // =========================
        // CHECK EXPIRY
        // =========================

        if (

                LocalDateTime.now()
                        .isAfter(

                                session
                                        .getExpiresAt()
                        )

        ) {

            session.setActive(false);

            sessionRepository.save(
                    session
            );

            return "Session Expired";
        }

        // =========================
        // VALID SESSION
        // =========================

        return session;
    }

    // =========================
    // REFRESH QR TOKEN
    // =========================

    @GetMapping("/refresh-token")
    public Object refreshQrToken(

            @RequestParam
            String sessionId

    ) {

        // =========================
        // FIND SESSION
        // =========================

        var optionalSession =

                sessionRepository
                        .findBySessionId(
                                sessionId
                        );

        // =========================
        // SESSION NOT FOUND
        // =========================

        if (

                optionalSession.isEmpty()

        ) {

            return "Session Not Found";
        }

        AttendanceSession session =

                optionalSession.get();

        // =========================
        // SESSION EXPIRED
        // =========================

        if (

                LocalDateTime.now()
                        .isAfter(

                                session
                                        .getExpiresAt()
                        )

        ) {

            session.setActive(false);

            sessionRepository.save(
                    session
            );

            return "Session Expired";
        }

        // =========================
        // GENERATE NEW TOKEN
        // =========================

        String newToken =

                UUID.randomUUID()
                        .toString();

        session.setQrToken(
                newToken
        );

        sessionRepository.save(
                session
        );

        return session;
    }
}