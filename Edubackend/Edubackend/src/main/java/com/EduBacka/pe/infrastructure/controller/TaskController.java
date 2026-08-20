package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.task.TaskRequest;
import com.EduBacka.pe.application.dto.task.TaskResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.TaskStatus;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.TaskService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/tasks")
@RequiredArgsConstructor
public class TaskController {

    private final TaskService taskService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<TaskResponse> create(Authentication authentication, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(taskService.create(getUser(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<TaskResponse>> getByUser(Authentication authentication) {
        return ResponseEntity.ok(taskService.getByUser(getUser(authentication)));
    }

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<TaskResponse>> getByCourse(Authentication authentication, @PathVariable Long courseId) {
        return ResponseEntity.ok(taskService.getByCourse(getUser(authentication), courseId));
    }

    @GetMapping("/deleted")
    public ResponseEntity<List<TaskResponse>> getDeleted(Authentication authentication) {
        return ResponseEntity.ok(taskService.getDeletedByUser(getUser(authentication)));
    }

    @PatchMapping("/{id}/restore")
    public ResponseEntity<TaskResponse> restore(Authentication authentication, @PathVariable Long id) {
        return ResponseEntity.ok(taskService.restore(getUser(authentication), id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<TaskResponse> update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody TaskRequest request) {
        return ResponseEntity.ok(taskService.update(getUser(authentication), id, request));
    }

    @PatchMapping("/{id}/status")
    public ResponseEntity<TaskResponse> updateStatus(Authentication authentication, @PathVariable Long id, @RequestParam TaskStatus status) {
        return ResponseEntity.ok(taskService.updateStatus(getUser(authentication), id, status));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        taskService.delete(getUser(authentication), id);
        return ResponseEntity.noContent().build();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
