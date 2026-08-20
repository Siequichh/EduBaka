package com.EduBacka.pe.application.dto.course;

import java.time.LocalDate;

public record CourseResponse(
        Long id,
        String name,
        String color,
        Long cycleId,
        String cycleName,
        LocalDate cycleStart,
        LocalDate cycleEnd
) {}
