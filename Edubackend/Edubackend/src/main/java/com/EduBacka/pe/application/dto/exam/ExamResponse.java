package com.EduBacka.pe.application.dto.exam;

import com.EduBacka.pe.domain.enumerate.ExamType;
import java.time.LocalDateTime;

public record ExamResponse(
        Long id,
        Long courseId,
        String courseName,
        String title,
        ExamType examType,
        LocalDateTime examDate,
        String notes
) {}
