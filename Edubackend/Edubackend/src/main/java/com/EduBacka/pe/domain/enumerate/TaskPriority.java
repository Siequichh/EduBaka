package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum TaskPriority implements DisplayableEnum {
    LOW("01", "Baja", true),
    MEDIUM("02", "Media", true),
    HIGH("03", "Alta", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
