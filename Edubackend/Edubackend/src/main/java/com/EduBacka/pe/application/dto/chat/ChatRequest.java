package com.EduBacka.pe.application.dto.chat;

import jakarta.validation.constraints.NotBlank;

import java.util.List;

public record ChatRequest(
        @NotBlank String message,
        List<ChatTurn> history
) {}
