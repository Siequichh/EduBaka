package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.ExamType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ExamTypeConverter implements AttributeConverter<ExamType, String> {
    @Override
    public String convertToDatabaseColumn(ExamType attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public ExamType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(ExamType.class, dbData);
    }
}
