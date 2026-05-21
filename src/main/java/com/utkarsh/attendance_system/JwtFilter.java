package com.utkarsh.attendance_system.filter;

import com.utkarsh.attendance_system.jwt.JwtUtil;

import jakarta.servlet.FilterChain;

import jakarta.servlet.ServletException;

import jakarta.servlet.http.HttpServletRequest;

import jakarta.servlet.http.HttpServletResponse;

import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;

import org.springframework.security.core.context.SecurityContextHolder;

import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;

import org.springframework.stereotype.Component;

import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

import java.util.Collections;

import jakarta.servlet.http.HttpServletResponse;

@Component

public class JwtFilter
        extends OncePerRequestFilter {

    @Override
    protected void doFilterInternal(

            HttpServletRequest request,

            HttpServletResponse response,

            FilterChain filterChain

    ) throws ServletException, IOException {
        if (
                request.getMethod()
                .equalsIgnoreCase(
                        "OPTIONS"
                )

        ) {

                response.setStatus(
                        HttpServletResponse.SC_OK
                );

                filterChain.doFilter(
                        request,
                        response
                );

                return;
        }

        final String authHeader =
                request.getHeader(
                        "Authorization"
                );

        String username = null;

        String jwt = null;

        // =========================
        // GET TOKEN
        // =========================

        if (

                authHeader != null

                        &&

                        authHeader.startsWith(
                                "Bearer "
                        )
        ) {

            jwt =
                    authHeader.substring(
                            7
                    );

            // =========================
            // VALIDATE TOKEN
            // =========================

            if (

                    JwtUtil.validateToken(
                            jwt
                    )
            ) {

                username =
                        JwtUtil.extractUsername(
                                jwt
                        );
            }
        }

        // =========================
        // SET AUTHENTICATION
        // =========================

        if (

                username != null

                        &&

                        SecurityContextHolder
                                .getContext()
                                .getAuthentication()

                                == null
        ) {

            UsernamePasswordAuthenticationToken authToken =

                    new UsernamePasswordAuthenticationToken(

                            username,

                            null,

                            Collections.emptyList()
                    );

            authToken.setDetails(

                    new WebAuthenticationDetailsSource()

                            .buildDetails(
                                    request
                            )
            );

            SecurityContextHolder
                    .getContext()
                    .setAuthentication(
                            authToken
                    );
        }

        filterChain.doFilter(
                request,
                response
        );
    }
}