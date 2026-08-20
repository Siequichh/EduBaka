package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.task.TaskRequest;
import com.EduBacka.pe.application.dto.task.TaskResponse;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.TaskStatus;

import java.util.List;

public interface TaskService {
    TaskResponse create(User user, TaskRequest request);
    List<TaskResponse> getByUser(User user);
    List<TaskResponse> getByCourse(User user, Long courseId);
    TaskResponse update(User user, Long id, TaskRequest request);
    TaskResponse updateStatus(User user, Long id, TaskStatus status);
    void delete(User user, Long id);
    List<TaskResponse> getDeletedByUser(User user);
    TaskResponse restore(User user, Long id);
}
