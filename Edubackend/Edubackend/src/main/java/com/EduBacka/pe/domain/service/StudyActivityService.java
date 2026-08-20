package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.activity.StreakResponse;
import com.EduBacka.pe.application.dto.activity.StudyActivityRequest;
import com.EduBacka.pe.application.dto.activity.StudyActivityResponse;
import com.EduBacka.pe.domain.entity.User;

import java.util.List;

public interface StudyActivityService {
    StudyActivityResponse logActivity(User user, StudyActivityRequest request);
    List<StudyActivityResponse> getHistory(User user);
    StreakResponse getStreak(User user);
}
