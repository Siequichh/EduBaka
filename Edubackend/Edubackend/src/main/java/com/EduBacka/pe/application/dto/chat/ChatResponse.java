package com.EduBacka.pe.application.dto.chat;

public record ChatResponse(
        String reply,
        int remainingToday
) {}
