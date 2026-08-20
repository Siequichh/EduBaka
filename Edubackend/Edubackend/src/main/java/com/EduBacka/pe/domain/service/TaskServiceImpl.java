package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.task.TaskRequest;
import com.EduBacka.pe.application.dto.task.TaskResponse;
import com.EduBacka.pe.domain.entity.Course;
import com.EduBacka.pe.domain.entity.StudyActivity;
import com.EduBacka.pe.domain.entity.Task;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.ActivityType;
import com.EduBacka.pe.domain.enumerate.TaskStatus;
import com.EduBacka.pe.domain.repository.CourseRepository;
import com.EduBacka.pe.domain.repository.StudyActivityRepository;
import com.EduBacka.pe.domain.repository.TaskRepository;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.TaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class TaskServiceImpl implements TaskService {

    private final TaskRepository taskRepository;
    private final CourseRepository courseRepository;
    private final StudyActivityRepository activityRepository;
    private final TaskMapper taskMapper;

    @Override
    @Transactional
    public TaskResponse create(User user, TaskRequest request) {
        Course course = null;
        if (request.courseId() != null) {
            course = courseRepository.findById(request.courseId())
                    .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso", request.courseId()));
        }

        Task task = Task.builder()
                .user(user).course(course)
                .title(request.title())
                .description(request.description())
                .dueDate(request.dueDate())
                .priority(request.priority())
                .status(request.status())
                .estimatedPomodoros(request.estimatedPomodoros())
                .isDeleted(false)
                .build();
        Task saved = taskRepository.save(task);

        activityRepository.save(StudyActivity.builder()
                .user(user).course(course)
                .activityType(ActivityType.GENERAL_STUDY)
                .description("Tarea creada: " + saved.getTitle())
                .pointsEarned(1)
                .build());

        return taskMapper.toResponse(saved);
    }

    @Override
    public List<TaskResponse> getByUser(User user) {
        return taskRepository.findByUserAndIsDeletedFalse(user).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<TaskResponse> getByCourse(User user, Long courseId) {
        return taskRepository.findByUserAndCourseIdAndIsDeletedFalse(user, courseId).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse update(User user, Long id, TaskRequest request) {
        Task task = getTaskOrThrow(user, id);

        Course course = null;
        if (request.courseId() != null) {
            course = courseRepository.findById(request.courseId())
                    .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                    .orElseThrow(() -> new ResourceNotFoundException("Curso", request.courseId()));
        }

        task.setCourse(course);
        task.setTitle(request.title());
        task.setDescription(request.description());
        task.setDueDate(request.dueDate());
        task.setPriority(request.priority());
        task.setStatus(request.status());
        task.setEstimatedPomodoros(request.estimatedPomodoros());

        return taskMapper.toResponse(taskRepository.save(task));
    }

    @Override
    @Transactional
    public TaskResponse updateStatus(User user, Long id, TaskStatus status) {
        Task task = getTaskOrThrow(user, id);
        boolean justCompleted = status == TaskStatus.COMPLETED && task.getStatus() != TaskStatus.COMPLETED;
        task.setStatus(status);
        Task saved = taskRepository.save(task);

        if (justCompleted) {
            activityRepository.save(StudyActivity.builder()
                    .user(user).course(task.getCourse())
                    .activityType(ActivityType.TASK_COMPLETION)
                    .description("Tarea completada: " + task.getTitle())
                    .pointsEarned(2)
                    .build());
        }

        return taskMapper.toResponse(saved);
    }

    @Override
    @Transactional
    public void delete(User user, Long id) {
        Task task = getTaskOrThrow(user, id);
        task.setDeleted(true);
        taskRepository.save(task);
    }

    @Override
    public List<TaskResponse> getDeletedByUser(User user) {
        return taskRepository.findByUserAndIsDeletedTrue(user).stream()
                .map(taskMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public TaskResponse restore(User user, Long id) {
        Task task = taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()) && t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Tarea", id));
        task.setDeleted(false);
        return taskMapper.toResponse(taskRepository.save(task));
    }

    private Task getTaskOrThrow(User user, Long id) {
        return taskRepository.findById(id)
                .filter(t -> t.getUser().getId().equals(user.getId()) && !t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Tarea", id));
    }
}
