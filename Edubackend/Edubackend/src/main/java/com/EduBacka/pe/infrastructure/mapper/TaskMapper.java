package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.task.TaskResponse;
import com.EduBacka.pe.domain.entity.Task;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring", uses = SubtaskMapper.class)
public interface TaskMapper {
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.name", target = "courseName")
    TaskResponse toResponse(Task task);
}
