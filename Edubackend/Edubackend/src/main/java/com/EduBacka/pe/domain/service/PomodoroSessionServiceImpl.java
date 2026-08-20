package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionRequest;
import com.EduBacka.pe.application.dto.pomodoro.PomodoroSessionResponse;
import com.EduBacka.pe.domain.entity.PomodoroSession;
import com.EduBacka.pe.domain.entity.StudyActivity;
import com.EduBacka.pe.domain.entity.Task;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.ActivityType;
import com.EduBacka.pe.domain.repository.PomodoroSessionRepository;
import com.EduBacka.pe.domain.repository.StudyActivityRepository;
import com.EduBacka.pe.domain.repository.TaskRepository;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.PomodoroSessionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class PomodoroSessionServiceImpl implements PomodoroSessionService {

    private final PomodoroSessionRepository pomodoroSessionRepository;
    private final TaskRepository taskRepository;
    private final StudyActivityRepository activityRepository;
    private final PomodoroSessionMapper mapper;

    @Override
    @Transactional
    public PomodoroSessionResponse logSession(User user, PomodoroSessionRequest request) {
        Task task = null;
        if (request.taskId() != null) {
            task = taskRepository.findById(request.taskId())
                    .filter(t -> t.getUser().getId().equals(user.getId()) && !t.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Tarea", request.taskId()));

            if (request.status() == com.EduBacka.pe.domain.enumerate.PomodoroStatus.FOCUS) {
                task.setCompletedPomodoros(task.getCompletedPomodoros() + 1);
                taskRepository.save(task);
            }
        }

        if (request.status() == com.EduBacka.pe.domain.enumerate.PomodoroStatus.FOCUS) {
            activityRepository.save(StudyActivity.builder()
                    .user(user).course(task != null ? task.getCourse() : null)
                    .activityType(ActivityType.GENERAL_STUDY)
                    .description("Sesión de pomodoro completada")
                    .pointsEarned(1)
                    .build());
        }

        PomodoroSession session = PomodoroSession.builder()
                .user(user).task(task)
                .startTime(request.startTime())
                .endTime(request.endTime())
                .durationMinutes(request.durationMinutes())
                .status(request.status())
                .build();

        return mapper.toResponse(pomodoroSessionRepository.save(session));
    }

    @Override
    public List<PomodoroSessionResponse> getHistory(User user) {
        return pomodoroSessionRepository.findByUserOrderByStartTimeDesc(user).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }
}
