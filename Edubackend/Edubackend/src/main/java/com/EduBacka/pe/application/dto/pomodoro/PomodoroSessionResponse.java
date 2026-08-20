package com.EduBacka.pe.application.dto.pomodoro;

import com.EduBacka.pe.domain.enumerate.PomodoroStatus;

import java.time.LocalDateTime;

public record PomodoroSessionResponse(
        Long id,
        Long taskId,
        String taskTitle,
        LocalDateTime startTime,
        LocalDateTime endTime,
        int durationMinutes,
        PomodoroStatus status
) {}
