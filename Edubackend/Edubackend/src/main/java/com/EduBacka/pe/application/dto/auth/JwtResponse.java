package com.EduBacka.pe.application.dto.auth;

import com.EduBacka.pe.domain.enumerate.UserRole;

public record JwtResponse(
        String accessToken,
        String refreshToken,
        String email,
        String fullName,
        UserRole role
) {}
