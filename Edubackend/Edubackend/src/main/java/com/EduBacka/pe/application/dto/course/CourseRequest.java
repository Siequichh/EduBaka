package com.EduBacka.pe.application.dto.course;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;

import java.time.LocalDate;

public record CourseRequest(
        @NotBlank String name,
        @NotBlank @Pattern(regexp = "^#[0-9A-Fa-f]{6}$") String color,
        @NotNull Long cycleId,
        @NotNull LocalDate cycleStart,
        @NotNull LocalDate cycleEnd
) {}
