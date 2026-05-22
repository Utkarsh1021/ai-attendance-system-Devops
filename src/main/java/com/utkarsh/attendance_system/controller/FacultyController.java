package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.Faculty;

import com.utkarsh.attendance_system.repository.FacultyRepository;

import com.utkarsh.attendance_system.jwt.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;

import org.springframework.web.bind.annotation.*;

@RestController

@RequestMapping("/faculty")

@CrossOrigin(origins = "*")

public class FacultyController {

    @Autowired
    private FacultyRepository
            facultyRepository;

    // =========================
    // REGISTER FACULTY
    // =========================

    @PostMapping("/register")
    public Object registerFaculty(

            @RequestBody
            Faculty faculty

    ) {

        Faculty existingFaculty =

                facultyRepository
                        .findByEmail(
                                faculty.getEmail()
                        );

        // =========================
        // FACULTY EXISTS
        // =========================

        if (existingFaculty != null) {

            return "Faculty already exists";
        }

        // =========================
        // SET ROLE
        // =========================

        faculty.setRole(
                "ROLE_FACULTY"
        );

        // =========================
        // SAVE FACULTY
        // =========================

        return facultyRepository.save(
                faculty
        );
    }

    // =========================
    // LOGIN FACULTY
    // =========================

    @PostMapping("/login")
    public Object loginFaculty(

            @RequestBody
            Faculty faculty

    ) {

        Faculty existingFaculty =

                facultyRepository
                        .findByEmail(
                                faculty.getEmail()
                        );

        // =========================
        // INVALID CREDENTIALS
        // =========================

        if (

                existingFaculty == null ||

                !existingFaculty
                        .getPassword()
                        .equals(

                                faculty
                                        .getPassword()
                        )

        ) {

            return "Invalid Credentials";
        }

        // =========================
        // GENERATE JWT
        // =========================

        String token =

                JwtUtil.generateToken(

                        existingFaculty
                                .getEmail()
                );

        // =========================
        // RETURN TOKEN
        // =========================

        return token;
    }

    // =========================
    // GET ALL FACULTIES
    // =========================

    @GetMapping
    public Object getAllFaculties() {

        return facultyRepository.findAll();
    }

    // =========================
    // DELETE FACULTY (ADMIN ONLY)
    // =========================

    @DeleteMapping("/{id}")
    public String deleteFaculty(

            @PathVariable
            Long id

    ) {

        try {

            facultyRepository.deleteById(id);

            return "Faculty deleted successfully";

        } catch (Exception e) {

            return "Failed to delete faculty: "
                    + e.getMessage();
        }
    }
}