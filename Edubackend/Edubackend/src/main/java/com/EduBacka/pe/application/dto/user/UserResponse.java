package com.EduBacka.pe.application.dto.user;

import com.EduBacka.pe.domain.enumerate.UserRole;

public record UserResponse(
        Long id,
        String email,
        String fullName,
        UserRole role,
        String authProvider,
        boolean isActive
) {}
