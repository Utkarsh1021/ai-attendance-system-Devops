package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.Student;
import com.utkarsh.attendance_system.service.StudentService;
import com.utkarsh.attendance_system.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;
@CrossOrigin(origins = "*")
@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

    // =========================
    // HOME API
    // =========================
    @GetMapping("/")
    public String home() {

        return "AI Attendance System Running";
    }

    // =========================
    // SIGNUP API
    // =========================
    @PostMapping("/signup")
    public Object signup(
            @RequestBody Student student
    ) {

        Student existingStudent =
                studentRepository.findByRegistrationNumber(
                        student.getRegistrationNumber()
                );

        if (existingStudent != null) {

            return "Registration number already exists";
        }

        return studentRepository.save(student);
    }

    // =========================
    // LOGIN API
    // =========================
    @PostMapping("/login")
    public Object login(
            @RequestBody Student student
    ) {


        System.out.println(
            "LOGIN ATTEMPT"
        );

        System.out.println(
            student.getRegistrationNumber()
        );

        System.out.println(
            student.getPassword()
        );

        Student existingStudent =
                studentRepository
                        .findByRegistrationNumberAndPassword(
                                student.getRegistrationNumber(),
                                student.getPassword()
                        );

        System.out.println(
            existingStudent
        );

        if (existingStudent == null) {

            return "Invalid Credentials";
        }

        return existingStudent;
    }

    // =========================
    // ADD STUDENT
    // =========================
    @PostMapping
    public Student addStudent(@RequestBody Student student) {

        return studentService.saveStudent(student);
    }

    // =========================
    // GET ALL STUDENTS
    // =========================
    @GetMapping
    public List<Student> getAllStudents() {

        return studentRepository.findAll();
    }

    // =========================
    // DELETE STUDENT (ADMIN ONLY)
    // =========================
    @DeleteMapping("/{id}")
    public String deleteStudent(@PathVariable Long id) {

        try {
            studentRepository.deleteById(id);
            return "Student deleted successfully";
        } catch (Exception e) {
            return "Failed to delete student: " + e.getMessage();
        }
    }
}