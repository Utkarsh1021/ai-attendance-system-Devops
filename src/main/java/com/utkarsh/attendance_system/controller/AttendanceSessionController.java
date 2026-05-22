package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.AttendanceSession;

import com.utkarsh.attendance_system.repository.AttendanceSessionRepository;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;

import java.util.UUID;
import java.util.HashMap;
import java.util.Map;

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
    public Map<String, Object> createSession(

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

        LocalDateTime now = LocalDateTime.now();
        session.setCreatedAt(now);

        // =========================
        // SET EXPIRY (2 minutes from now)
        // =========================

        LocalDateTime expiresAt = now.plusMinutes(2);
        session.setExpiresAt(expiresAt);

        // =========================
        // ACTIVE SESSION
        // =========================

        session.setActive(true);

        AttendanceSession savedSession = sessionRepository.save(session);
        
        // Convert to epoch milliseconds for frontend
        long expiresAtMillis = expiresAt
                .atZone(ZoneId.systemDefault())
                .toInstant()
                .toEpochMilli();
        
        // Log for debugging
        System.out.println("Session created at: " + now);
        System.out.println("Session expires at: " + expiresAt);
        System.out.println("Expires at (millis): " + expiresAtMillis);
        System.out.println("Current time (millis): " + System.currentTimeMillis());

        // Return session with epoch time
        Map<String, Object> response = new HashMap<>();
        response.put("id", savedSession.getId());
        response.put("sessionId", savedSession.getSessionId());
        response.put("subject", savedSession.getSubject());
        response.put("section", savedSession.getSection());
        response.put("facultyName", savedSession.getFacultyName());
        response.put("qrToken", savedSession.getQrToken());
        response.put("createdAt", savedSession.getCreatedAt().toString());
        response.put("expiresAt", savedSession.getExpiresAt().toString());
        response.put("expiresAtMillis", expiresAtMillis); // Add epoch time
        response.put("active", savedSession.isActive());

        return response;
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

        LocalDateTime currentTime = LocalDateTime.now();
        LocalDateTime expiryTime = session.getExpiresAt();
        
        // Log for debugging
        System.out.println("Refresh token check:");
        System.out.println("Current time: " + currentTime);
        System.out.println("Expiry time: " + expiryTime);
        System.out.println("Is expired: " + currentTime.isAfter(expiryTime));

        if (currentTime.isAfter(expiryTime)) {

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