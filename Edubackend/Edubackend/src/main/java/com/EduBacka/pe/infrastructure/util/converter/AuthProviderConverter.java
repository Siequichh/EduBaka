package com.EduBacka.pe.infrastructure.util.converter;

import com.EduBacka.pe.domain.enumerate.DisplayableEnum;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import jakarta.persistence.AttributeConverter;
import jakarta.persistence.Converter;

@Converter(autoApply = true)
public class AuthProviderConverter implements AttributeConverter<AuthProvider, String> {
    @Override
    public String convertToDatabaseColumn(AuthProvider attribute) {
        return attribute == null ? null : attribute.getCode();
    }

    @Override
    public AuthProvider convertToEntityAttribute(String dbData) {
        return dbData == null ? null : DisplayableEnum.fromCode(AuthProvider.class, dbData);
    }
}
