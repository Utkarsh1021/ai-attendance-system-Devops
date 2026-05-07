package com.utkarsh.attendance_system.service;

import com.utkarsh.attendance_system.entity.Student;
import com.utkarsh.attendance_system.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;

    public Student saveStudent(Student student) {
        return studentRepository.save(student);
    }
}