package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.chat.ChatRequest;
import com.EduBacka.pe.application.dto.chat.ChatResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.domain.service.GeminiChatService;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
@RequiredArgsConstructor
public class ChatController {

    private final GeminiChatService geminiChatService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ChatResponse> chat(Authentication authentication, @Valid @RequestBody ChatRequest request) {
        User user = userRepository.findByEmail(authentication.getName())
                .orElseThrow(() -> new ResourceNotFoundException("Usuario no encontrado"));
        return ResponseEntity.ok(geminiChatService.ask(user, request));
    }
}
