package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.ActivityType;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class ActivityTypeConverter implements AttributeConverter<ActivityType, String> {
    @Override
    public String convertToDatabaseColumn(ActivityType attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public ActivityType convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(ActivityType.class, dbData);
    }
}
