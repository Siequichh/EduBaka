package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.activity.StreakResponse;
import com.EduBacka.pe.application.dto.activity.StudyActivityRequest;
import com.EduBacka.pe.application.dto.activity.StudyActivityResponse;
import com.EduBacka.pe.domain.entity.Course;
import com.EduBacka.pe.domain.entity.StudyActivity;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.CourseRepository;
import com.EduBacka.pe.domain.repository.StudyActivityRepository;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.StudyActivityMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StudyActivityServiceImpl implements StudyActivityService {

    private final StudyActivityRepository activityRepository;
    private final CourseRepository courseRepository;
    private final StudyActivityMapper mapper;

    @Override
    @Transactional
    public StudyActivityResponse logActivity(User user, StudyActivityRequest request) {
        Course course = null;
        if (request.courseId() != null) {
            course = courseRepository.findById(request.courseId())
                    .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso", request.courseId()));
        }

        StudyActivity activity = StudyActivity.builder()
                .user(user).course(course)
                .activityType(request.activityType())
                .description(request.description())
                .pointsEarned(request.pointsEarned())
                .build();

        return mapper.toResponse(activityRepository.save(activity));
    }

    @Override
    public List<StudyActivityResponse> getHistory(User user) {
        return activityRepository.findByUserOrderByCreatedAtDesc(user).stream()
                .map(mapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public StreakResponse getStreak(User user) {
        List<LocalDate> activeDates = activityRepository.findDistinctActivityDates(user).stream()
                .map(java.sql.Date::toLocalDate)
                .collect(Collectors.toList());
        Set<LocalDate> activeSet = new HashSet<>(activeDates);

        LocalDate cursor = LocalDate.now();
        if (!activeSet.contains(cursor)) {
            cursor = cursor.minusDays(1);
            if (!activeSet.contains(cursor)) {
                return new StreakResponse(0, activeDates);
            }
        }

        int streak = 0;
        while (activeSet.contains(cursor)) {
            streak++;
            cursor = cursor.minusDays(1);
        }
        return new StreakResponse(streak, activeDates);
    }
}
