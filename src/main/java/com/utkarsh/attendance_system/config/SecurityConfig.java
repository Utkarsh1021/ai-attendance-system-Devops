package com.utkarsh.attendance_system.config;

import com.utkarsh.attendance_system.filter.JwtFilter;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
//import org.springframework.stereotype.Component;

import java.util.List;

@Configuration
@EnableWebSecurity

public class SecurityConfig {

    // =========================
    // JWT FILTER
    // =========================

    private final JwtFilter jwtFilter;

    public SecurityConfig(

            JwtFilter jwtFilter

    ) {

        this.jwtFilter =
                jwtFilter;
    }

    // =========================
    // SECURITY FILTER CHAIN
    // =========================

    @Bean
    public SecurityFilterChain
    securityFilterChain(

            HttpSecurity http

    ) throws Exception {

        http

                // =========================
                // DISABLE CSRF
                // =========================

                .csrf(csrf -> csrf.disable())

                // =========================
                // ENABLE CORS
                // =========================

                .cors(cors -> {

                })

                // =========================
                // STATELESS SESSION
                // =========================

                .sessionManagement(session ->

                        session.sessionCreationPolicy(

                                SessionCreationPolicy.STATELESS
                        )
                )

                // =========================
                // AUTHORIZE REQUESTS
                // =========================

                .authorizeHttpRequests(auth -> auth

                        // .requestMatchers(

                        //         "/auth/**",

                        //         "/students/**",

                        //         "/faculty/login",

                        //         "/faculty/register",

                        //         "/attendance/**",

                        //         "/session/**"

                        // ).permitAll()

                        // .anyRequest()

                        //.authenticated()
                        .anyRequest().permitAll()
                )

                // =========================
                // DISABLE DEFAULT LOGIN
                // =========================

                .formLogin(form ->

                        form.disable()
                )

                // =========================
                // DISABLE HTTP BASIC
                // =========================

                .httpBasic(httpBasic ->

                        httpBasic.disable()
                )

                // =========================
                // ADD JWT FILTER
                // =========================

                .addFilterBefore(

                        jwtFilter,

                        UsernamePasswordAuthenticationFilter.class
                );

        return http.build();
    }

    // =========================
    // CORS CONFIGURATION
    // =========================

    @Bean
    public CorsConfigurationSource
    corsConfigurationSource() {

        CorsConfiguration configuration =
                new CorsConfiguration();

        // =========================
        // ALLOWED ORIGINS
        // =========================

        configuration.setAllowedOrigins(

                List.of(

                        "http://localhost:3000",

                        "http://localhost:3001",

                        "http://localhost:8085",

                        "http://localhost",

                        "https://rajutkarsh.me"
                )
        );

        // =========================
        // ALLOWED METHODS
        // =========================

        configuration.setAllowedMethods(

                List.of(

                        "GET",

                        "POST",

                        "PUT",

                        "DELETE",

                        "OPTIONS"
                )
        );

        // =========================
        // ALLOWED HEADERS
        // =========================

        configuration.setAllowedHeaders(

                List.of("*")
        );

        // =========================
        // ALLOW CREDENTIALS
        // =========================

        configuration.setAllowCredentials(
                true
        );

        // =========================
        // REGISTER CONFIG
        // =========================

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(

                "/**",

                configuration
        );

        return source;
    }
}