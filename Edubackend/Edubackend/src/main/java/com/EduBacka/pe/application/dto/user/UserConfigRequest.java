package com.EduBacka.pe.application.dto.user;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDate;

public record UserConfigRequest(
        @NotBlank String fullName,
        String avatarUrl,
        String university
) {}
