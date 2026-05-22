package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.Faculty;

import org.springframework.data.jpa.repository.JpaRepository;

public interface FacultyRepository
        extends JpaRepository<Faculty, Long> {

    Faculty findByEmail(
            String email
    );
}