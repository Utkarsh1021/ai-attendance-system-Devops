package com.utkarsh.attendance_system.entity;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
@Table(name = "students")
public class Student {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String registrationNumber;

    private String password;

    private String name;

    private String email;

    private String section;

    private String faceEncodingPath;
}