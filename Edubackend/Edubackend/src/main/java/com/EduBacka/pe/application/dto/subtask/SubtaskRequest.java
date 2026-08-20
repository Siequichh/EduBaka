package com.EduBacka.pe.application.dto.subtask;

import jakarta.validation.constraints.NotBlank;

public record SubtaskRequest(
        @NotBlank String title
) {}
