package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.activity.StudyActivityResponse;
import com.EduBacka.pe.domain.entity.StudyActivity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface StudyActivityMapper {
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.name", target = "courseName")
    @Mapping(source = "activityType.displayName", target = "activityTypeLabel")
    StudyActivityResponse toResponse(StudyActivity activity);
}
