package com.EduBacka.pe.application.dto.activity;

import java.time.LocalDate;
import java.util.List;

public record StreakResponse(
        int currentStreak,
        List<LocalDate> activeDates
) {}
