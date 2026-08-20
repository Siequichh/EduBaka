package com.EduBacka.pe.application.dto.subtask;

public record SubtaskResponse(
        Long id,
        String title,
        boolean done,
        int position
) {}
