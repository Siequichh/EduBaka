package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ActivityType implements DisplayableEnum {
    TASK_COMPLETION("01", "Tarea Completada", true),
    EXAM_PREPARATION("02", "Preparación de Examen", true),
    GENERAL_STUDY("03", "Estudio General", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
