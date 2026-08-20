package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum UserRole implements DisplayableEnum {
    USER("01", "Usuario", true),
    ADMIN("02", "Administrador", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
