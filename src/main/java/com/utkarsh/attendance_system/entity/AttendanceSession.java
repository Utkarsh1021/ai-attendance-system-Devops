package com.utkarsh.attendance_system.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
public class AttendanceSession {

    // =========================
    // PRIMARY KEY
    // =========================

    @Id

    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )

    private Long id;

    // =========================
    // SESSION ID
    // =========================

    private String sessionId;

    // =========================
    // SUBJECT
    // =========================

    private String subject;

    // =========================
    // SECTION
    // =========================

    private String section;

    // =========================
    // FACULTY NAME
    // =========================

    private String facultyName;

    // =========================
    // QR TOKEN
    // =========================

    private String qrToken;

    // =========================
    // CREATED TIME
    // =========================

    private LocalDateTime createdAt;

    // =========================
    // EXPIRY TIME
    // =========================

    private LocalDateTime expiresAt;

    // =========================
    // ACTIVE STATUS
    // =========================

    private boolean active;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getSessionId() {
        return sessionId;
    }

    public void setSessionId(
            String sessionId
    ) {
        this.sessionId = sessionId;
    }

    public String getSubject() {
        return subject;
    }

    public void setSubject(
            String subject
    ) {
        this.subject = subject;
    }

    public String getSection() {
        return section;
    }

    public void setSection(
            String section
    ) {
        this.section = section;
    }

    public String getFacultyName() {
        return facultyName;
    }

    public void setFacultyName(
            String facultyName
    ) {
        this.facultyName = facultyName;
    }

    public String getQrToken() {
        return qrToken;
    }

    public void setQrToken(
            String qrToken
    ) {
        this.qrToken = qrToken;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(
            LocalDateTime expiresAt
    ) {
        this.expiresAt = expiresAt;
    }

    public boolean isActive() {
        return active;
    }

    public void setActive(
            boolean active
    ) {
        this.active = active;
    }
}