package com.EduBacka.pe.application.dto.activity;

import com.EduBacka.pe.domain.enumerate.ActivityType;

import java.time.LocalDateTime;

public record StudyActivityResponse(
        Long id,
        Long courseId,
        String courseName,
        ActivityType activityType,
        String activityTypeLabel,
        String description,
        int pointsEarned,
        LocalDateTime createdAt
) {}
