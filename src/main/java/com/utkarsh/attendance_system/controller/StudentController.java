package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.entity.Student;
import com.utkarsh.attendance_system.service.StudentService;
import com.utkarsh.attendance_system.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/students")
public class StudentController {

    @Autowired
    private StudentService studentService;

    @Autowired
    private StudentRepository studentRepository;

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
}