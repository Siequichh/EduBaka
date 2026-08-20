package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.PomodoroStatus;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class PomodoroStatusConverter implements AttributeConverter<PomodoroStatus, String> {
    @Override
    public String convertToDatabaseColumn(PomodoroStatus attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public PomodoroStatus convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(PomodoroStatus.class, dbData);
    }
}
