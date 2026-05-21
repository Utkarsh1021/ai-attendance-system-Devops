package com.utkarsh.attendance_system.config;

import com.utkarsh.attendance_system.filter.JwtFilter;

import org.springframework.context.annotation.Bean;

import org.springframework.context.annotation.Configuration;

import org.springframework.security.config.annotation.web.builders.HttpSecurity;

import org.springframework.security.config.http.SessionCreationPolicy;

import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import org.springframework.web.cors.CorsConfiguration;

import org.springframework.web.cors.CorsConfigurationSource;

import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

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

                        .anyRequest()

                        .permitAll()

                        // PUBLIC ROUTES

                        //.requestMatchers(

                         //       "/auth/**",

                          //      "/students/**"

                        //).permitAll()

                        // ATTENDANCE ROUTES

                        //.requestMatchers(

                        //        "/attendance/**"

                        //).permitAll()

                        // ALL OTHER ROUTES

                        //.anyRequest()

                        //.authenticated()
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

        configuration.setAllowedOrigins(

                List.of(
                        "http://localhost:3000"
                )
        );

        configuration.setAllowedMethods(

                List.of(
                        "GET",
                        "POST",
                        "PUT",
                        "DELETE",
                        "OPTIONS"
                )
        );

        configuration.setAllowedHeaders(

                List.of("*")
        );

        configuration.setAllowCredentials(
                true
        );

        UrlBasedCorsConfigurationSource source =
                new UrlBasedCorsConfigurationSource();

        source.registerCorsConfiguration(

                "/**",

                configuration
        );

        return source;
    }
}