package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionRequest;
import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionResponse;
import com.EduBacka.pe.domain.entity.User;

import java.util.List;

public interface PomodoroSessionService {
    PomodoroSessionResponse logSession(User user, PomodoroSessionRequest request);
    List<PomodoroSessionResponse> getHistory(User user);
}
