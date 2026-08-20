package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.TaskPriority;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class TaskPriorityConverter implements AttributeConverter<TaskPriority, String> {
    @Override
    public String convertToDatabaseColumn(TaskPriority attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public TaskPriority convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(TaskPriority.class, dbData);
    }
}
