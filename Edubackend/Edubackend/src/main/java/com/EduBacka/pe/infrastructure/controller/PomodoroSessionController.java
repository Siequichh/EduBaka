package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionRequest;
import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.PomodoroSessionService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/pomodoros")
@RequiredArgsConstructor
public class PomodoroSessionController {

    private final PomodoroSessionService pomodoroService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<PomodoroSessionResponse> logSession(Authentication authentication, @Valid @RequestBody PomodoroSessionRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(pomodoroService.logSession(getUser(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<PomodoroSessionResponse>> getHistory(Authentication authentication) {
        return ResponseEntity.ok(pomodoroService.getHistory(getUser(authentication)));
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
