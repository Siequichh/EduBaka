package com.EduBacka.pe.application.dto.cycle;

import com.EduBacka.pe.domain.entity.AcademicCycle;

public record CycleResponse(
        Long id,
        String name
) {
    public static CycleResponse from(AcademicCycle cycle) {
        return new CycleResponse(cycle.getId(), cycle.getName());
    }
}
