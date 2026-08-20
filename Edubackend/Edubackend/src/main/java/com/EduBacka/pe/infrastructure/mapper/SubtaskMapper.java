package com.EduBacka.pe.infrastructure.mapper;

import com.EduBacka.pe.application.dto.subtask.SubtaskResponse;
import com.EduBacka.pe.domain.entity.Subtask;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface SubtaskMapper {
    SubtaskResponse toResponse(Subtask subtask);
}
