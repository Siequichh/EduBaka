package com.EduBacka.pe.application.dto.activity;

import com.EduBacka.pe.domain.enumerate.ActivityType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;

public record StudyActivityRequest(
        Long courseId,
        @NotNull ActivityType activityType,
        String description,
        @PositiveOrZero int pointsEarned
) {}
