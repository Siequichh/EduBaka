package com.EduBacka.pe.application.dto.pomodoro;

import com.EduBacka.pe.domain.enumerate.PomodoroStatus;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.time.LocalDateTime;

public record PomodoroSessionRequest(
        Long taskId,
        @NotNull LocalDateTime startTime,
        LocalDateTime endTime,
        @Positive int durationMinutes,
        @NotNull PomodoroStatus status
) {}
