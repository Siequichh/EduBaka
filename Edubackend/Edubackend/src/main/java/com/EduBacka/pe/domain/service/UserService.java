package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.user.UserConfigRequest;
import com.EduBacka.pe.application.dto.user.UserProfileResponse;
import com.EduBacka.pe.application.dto.user.UserResponse;
import com.EduBacka.pe.domain.entity.User;

import java.util.List;

public interface UserService {
    UserProfileResponse getProfile(User user);
    UserProfileResponse updateConfig(User user, UserConfigRequest request);
    UserResponse getCurrentUser(String email);
    List<UserResponse> getAllUsers();
    void toggleUserStatus(Long id);
}
