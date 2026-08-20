package com.EduBacka.pe.application.dto.task;

import com.EduBacka.pe.application.dto.subtask.SubtaskResponse;
import com.EduBacka.pe.domain.enumerate.TaskPriority;
import com.EduBacka.pe.domain.enumerate.TaskStatus;

import java.time.LocalDateTime;
import java.util.List;

public record TaskResponse(
        Long id,
        Long courseId,
        String courseName,
        String title,
        String description,
        LocalDateTime dueDate,
        TaskPriority priority,
        TaskStatus status,
        Integer estimatedPomodoros,
        int completedPomodoros,
        List<SubtaskResponse> subtasks
) {}
