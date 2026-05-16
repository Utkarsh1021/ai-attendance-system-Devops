package com.utkarsh.attendance_system.repository;

import com.utkarsh.attendance_system.entity.Attendance;

import org.springframework.data.jpa.repository.JpaRepository;

public interface AttendanceRepository
        extends JpaRepository<Attendance, Long> {

}