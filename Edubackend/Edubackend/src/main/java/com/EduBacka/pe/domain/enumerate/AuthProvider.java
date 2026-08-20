package com.EduBacka.pe.domain.enumerate;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@Getter
@RequiredArgsConstructor
public enum AuthProvider implements DisplayableEnum {
    LOCAL("01", "Local", true),
    GOOGLE("02", "Google", true);

    private final String code;
    private final String displayName;
    private final boolean available;
}
