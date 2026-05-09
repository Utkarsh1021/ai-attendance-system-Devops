package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.Student;
import org.springframework.data.jpa.repository.JpaRepository;

public interface StudentRepository
        extends JpaRepository<Student, Long> {

    Student findByRegistrationNumber(
            String registrationNumber
    );

    Student findByRegistrationNumberAndPassword(
            String registrationNumber,
            String password
    );
}