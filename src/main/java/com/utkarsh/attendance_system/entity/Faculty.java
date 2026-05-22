package com.utkarsh.attendance_system.entity;

import jakarta.persistence.*;

@Entity

@Table(name = "faculty")

public class Faculty {

    @Id

    @GeneratedValue(
            strategy =
                    GenerationType.IDENTITY
    )

    private Long id;

    // =========================
    // FACULTY DETAILS
    // =========================

    private String facultyId;

    private String name;

    private String email;

    private String password;

    private String department;

    private String role;

    // =========================
    // GETTERS & SETTERS
    // =========================

    public Long getId() {

        return id;
    }

    public void setId(
            Long id
    ) {

        this.id = id;
    }

    public String getFacultyId() {

        return facultyId;
    }

    public void setFacultyId(

            String facultyId

    ) {

        this.facultyId =
                facultyId;
    }

    public String getName() {

        return name;
    }

    public void setName(
            String name
    ) {

        this.name = name;
    }

    public String getEmail() {

        return email;
    }

    public void setEmail(
            String email
    ) {

        this.email = email;
    }

    public String getPassword() {

        return password;
    }

    public void setPassword(

            String password

    ) {

        this.password =
                password;
    }

    public String getDepartment() {

        return department;
    }

    public void setDepartment(

            String department

    ) {

        this.department =
                department;
    }

    public String getRole() {

        return role;
    }

    public void setRole(
            String role
    ) {

        this.role = role;
    }
}