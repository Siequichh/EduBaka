package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.exam.ExamResponse;
import com.EduBacka.pe.domain.entity.Exam;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExamMapper {
    @Mapping(source = "course.id", target = "courseId")
    @Mapping(source = "course.name", target = "courseName")
    ExamResponse toResponse(Exam exam);
}
