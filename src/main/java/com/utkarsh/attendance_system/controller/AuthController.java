package com.utkarsh.attendance_system.controller;

import com.utkarsh.attendance_system.jwt.JwtUtil;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController

@RequestMapping("/auth")

@CrossOrigin(origins = "*")

public class AuthController {

    @GetMapping("/test")
    public String test() {

        return "AUTH WORKING";
    }

    @PostMapping("/login")
    public Map<String, String> login(

            @RequestBody
            Map<String, String> body

    ) {

        String username =
                body.get("username");

        String password =
                body.get("password");

        if (

                username.equals("admin")

                &&

                password.equals("admin123")
        ) {

            String token =
                    JwtUtil.generateToken(
                            username
                    );

            Map<String, String> response =
                    new HashMap<>();

            response.put(
                    "token",
                    token
            );

            return response;
        }

        throw new RuntimeException(
                "Invalid Credentials"
        );
    }
}