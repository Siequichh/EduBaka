package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TaskStatus implements DisplayableEnum {
    PENDING("01", "Pendiente", true),
    IN_PROGRESS("02", "En Progreso", true),
    COMPLETED("03", "Completada", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
