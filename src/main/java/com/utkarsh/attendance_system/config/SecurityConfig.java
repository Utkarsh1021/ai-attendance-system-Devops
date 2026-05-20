package com.utkarsh.attendance_system.config;

import com.utkarsh.attendance_system.filter.JwtFilter;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

@Configuration

public class SecurityConfig {

    private final JwtFilter jwtFilter;

    public SecurityConfig(

            JwtFilter jwtFilter

    ) {

        this.jwtFilter =
                jwtFilter;
    }

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

                        // PUBLIC ROUTES

                        .requestMatchers(

                                "/auth/**",

                                "/students/**"

                        ).permitAll()

                        // PROTECTED ROUTES

                        .requestMatchers(

                                "/attendance/**"

                        ).authenticated()

                        // ALL OTHER ROUTES

                        .anyRequest()

                        .authenticated()
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
}