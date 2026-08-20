package com.EduBacka.pe.application.dto.task;

import com.EduBacka.pe.domain.enumerate.TaskPriority;
import com.EduBacka.pe.domain.enumerate.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record TaskRequest(
        Long courseId,
        @NotBlank String title,
        String description,
        LocalDateTime dueDate,
        @NotNull TaskPriority priority,
        @NotNull TaskStatus status,
        Integer estimatedPomodoros
) {}
