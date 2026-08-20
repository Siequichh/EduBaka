package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.user.UserConfigRequest;
import com.EduBacka.pe.application.dto.user.UserProfileResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.UserService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/user")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;
    private final UserRepository userRepository;

    @GetMapping("/profile")
    public ResponseEntity<UserProfileResponse> getProfile(Authentication authentication) {
        return ResponseEntity.ok(userService.getProfile(getUser(authentication)));
    }

    @PutMapping("/profile")
    public ResponseEntity<UserProfileResponse> updateProfile(Authentication authentication, @Valid @RequestBody UserConfigRequest request) {
        return ResponseEntity.ok(userService.updateConfig(getUser(authentication), request));
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
