package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum PomodoroStatus implements DisplayableEnum {
    FOCUS("01", "Enfoque", true),
    SHORT_BREAK("02", "Descanso Corto", true),
    LONG_BREAK("03", "Descanso Largo", true),
    INTERRUPTED("04", "Interrumpido", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
