package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.course.CourseRequest;
import com.EduBacka.pe.application.dto.course.CourseResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.CourseService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@RequiredArgsConstructor
public class CourseController {

    private final CourseService courseService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<CourseResponse> create(Authentication authentication, @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(courseService.create(getUser(authentication), request));
    }

    @GetMapping
    public ResponseEntity<List<CourseResponse>> getByUser(Authentication authentication) {
        return ResponseEntity.ok(courseService.getByUser(getUser(authentication)));
    }

    @PutMapping("/{id}")
    public ResponseEntity<CourseResponse> update(Authentication authentication, @PathVariable Long id, @Valid @RequestBody CourseRequest request) {
        return ResponseEntity.ok(courseService.update(getUser(authentication), id, request));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(Authentication authentication, @PathVariable Long id) {
        courseService.delete(getUser(authentication), id);
        return ResponseEntity.noContent().build();
    }

    private User getUser(Authentication authentication) {
        return userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
    }
}
