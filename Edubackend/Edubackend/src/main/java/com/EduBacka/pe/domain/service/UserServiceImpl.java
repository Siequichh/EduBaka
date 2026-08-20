package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.user.UserConfigRequest;
import com.EduBacka.pe.application.dto.user.UserProfileResponse;
import com.EduBacka.pe.application.dto.user.UserResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.domain.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;

    @Override
    public UserProfileResponse getProfile(User user) {
        return UserProfileResponse.from(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateConfig(User user, UserConfigRequest request) {
        user.setFullName(request.fullName());
        if (request.avatarUrl() != null) user.setAvatarUrl(request.avatarUrl());
        if (request.university() != null) user.setUniversity(request.university());
        return UserProfileResponse.from(userRepository.save(user));
    }

    @Override
    public UserResponse getCurrentUser(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return new UserResponse(user.getId(), user.getEmail(), user.getFullName(), user.getRole(), user.getAuthProvider().toString(), user.isActive());
    }

    @Override
    public List<UserResponse> getAllUsers() {
        return userRepository.findAll().stream()
                .map(u -> new UserResponse(u.getId(), u.getEmail(), u.getFullName(), u.getRole(), u.getAuthProvider().toString(), u.isActive()))
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public void toggleUserStatus(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Usuario", id));
        user.setActive(!user.isActive());
        userRepository.save(user);
    }
}
