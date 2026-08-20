package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.TaskStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TaskStatusConverter implements AttributeConverter<TaskStatus, String> {
    @Override
    public String convertToDatabaseColumn(TaskStatus attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public TaskStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(TaskStatus.class, dbData);
    }
}
