package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum ExamType implements DisplayableEnum {
    PARCIAL("01", "Parcial", true),
    FINAL("02", "Final", true),
    PRACTICA("03", "Práctica", true),
    OTRO("04", "Otro", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
