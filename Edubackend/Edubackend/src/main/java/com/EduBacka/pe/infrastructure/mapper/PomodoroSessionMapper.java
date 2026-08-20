package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionResponse;
import com.EduBacka.pe.domain.entity.PomodoroSession;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface PomodoroSessionMapper {
    @Mapping(source = "task.id", target = "taskId")
    @Mapping(source = "task.title", target = "taskTitle")
    PomodoroSessionResponse toResponse(PomodoroSession session);
}
