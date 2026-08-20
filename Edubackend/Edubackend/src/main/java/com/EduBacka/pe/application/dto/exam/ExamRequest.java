package com.EduBacka.pe.application.dto.exam;

import com.EduBacka.pe.domain.enumerate.ExamType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDateTime;

public record ExamRequest(
        @NotNull Long courseId,
        @NotBlank String title,
        @NotNull ExamType examType,
        @NotNull LocalDateTime examDate,
        String notes
) {}
