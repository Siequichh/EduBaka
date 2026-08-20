package com.EduBacka.pe.application.dto.user;

import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import com.EduBacka.pe.domain.enumerate.UserRole;

public record UserProfileResponse(
        Long id,
        String email,
        String fullName,
        String avatarUrl,
        String avatarInitials,
        String university,
        UserRole role,
        AuthProvider authProvider
) {
    public static UserProfileResponse from(User user) {
        return new UserProfileResponse(
                user.getId(),
                user.getEmail(),
                user.getFullName(),
                user.getAvatarUrl(),
                user.getAvatarInitials(),
                user.getUniversity(),
                user.getRole(),
                user.getAuthProvider()
        );
    }
}
