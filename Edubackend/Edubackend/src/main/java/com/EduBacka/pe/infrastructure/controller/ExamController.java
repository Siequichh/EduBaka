package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.exam.ExamRequest;
import com.EduBacka.pe.application.dto.exam.ExamResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.ExamService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/exams")
@RequiredArgsConstructor
public class ExamController {

    private final ExamService examService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ExamResponse> create(Authentication authentication, @Valid @RequestBody ExamRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(examService.create(getUser(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<ExamResponse>> getByUser(Authentication authentication) {
        return ResponseEntity.ok(examService.getByUser(getUser(authentication)));
    }

    @GetMapping("/upcoming")
    public ResponseEntity<List<ExamResponse>> getUpcoming(Authentication authentication) {
        return ResponseEntity.ok(examService.getUpcoming(getUser(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<ExamResponse> update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody ExamRequest request) {
        return ResponseEntity.ok(examService.update(getUser(authentication), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        examService.delete(getUser(authentication), id);
        return ResponseEntity.noContent().build();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
