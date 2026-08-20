package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.course.CourseResponse;
import com.EduBacka.pe.domain.entity.Course;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CourseMapper {
    @Mapping(source = "cycle.id", target = "cycleId")
    @Mapping(source = "cycle.name", target = "cycleName")
    CourseResponse toResponse(Course course);
}
