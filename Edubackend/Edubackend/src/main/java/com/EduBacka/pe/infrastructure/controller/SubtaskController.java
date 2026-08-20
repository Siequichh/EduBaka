package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.subtask.SubtaskRequest;
import com.EduBacka.pe.application.dto.subtask.SubtaskResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.SubtaskService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/tasks/{taskId}/subtasks")
@RequiredArgsConstructor
public class SubtaskController {

    private final SubtaskService subtaskService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<SubtaskResponse> create(Authentication authentication, @PathVariable Long taskId,
                                                    @Valid @RequestBody SubtaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(subtaskService.create(getUser(authentication), taskId, request));
    }

    @PatchMapping("/{subtaskId}/toggle")
    public ResponseEntity<SubtaskResponse> toggle(Authentication authentication, @PathVariable Long taskId,
                                                    @PathVariable Long subtaskId) {
        return ResponseEntity.ok(subtaskService.toggle(getUser(authentication), taskId, subtaskId));
    }

    @DeleteMapping("/{subtaskId}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long taskId,
                                        @PathVariable Long subtaskId) {
        subtaskService.delete(getUser(authentication), taskId, subtaskId);
        return ResponseEntity.noContent().build();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
