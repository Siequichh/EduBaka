package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.activity.StreakResponse;
import com.EduBacka.pe.application.dto.activity.StudyActivityRequest;
import com.EduBacka.pe.application.dto.activity.StudyActivityResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.StudyActivityService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class StudyActivityController {

    private final StudyActivityService activityService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<StudyActivityResponse> logActivity(Authentication authentication, @Valid @RequestBody StudyActivityRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(activityService.logActivity(getUser(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<StudyActivityResponse>> getHistory(Authentication authentication) {
        return ResponseEntity.ok(activityService.getHistory(getUser(authentication)));
    }

    @GetMapping("/streak")
    public ResponseEntity<StreakResponse> getStreak(Authentication authentication) {
        return ResponseEntity.ok(activityService.getStreak(getUser(authentication)));
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
