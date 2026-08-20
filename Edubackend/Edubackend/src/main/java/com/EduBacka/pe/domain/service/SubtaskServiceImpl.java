package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.subtask.SubtaskRequest;
import com.EduBacka.pe.application.dto.subtask.SubtaskResponse;
import com.EduBacka.pe.domain.entity.Subtask;
import com.EduBacka.pe.domain.entity.Task;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.SubtaskRepository;
import com.EduBacka.pe.domain.repository.TaskRepository;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.SubtaskMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class SubtaskServiceImpl implements SubtaskService {

    private final TaskRepository taskRepository;
    private final SubtaskRepository subtaskRepository;
    private final SubtaskMapper subtaskMapper;

    @Override
    @Transactional
    public SubtaskResponse create(User user, Long taskId, SubtaskRequest request) {
        Task task = getTaskOrThrow(user, taskId);
        Subtask subtask = Subtask.builder()
                .task(task)
                .title(request.title())
                .position(task.getSubtasks().size())
                .build();
        return subtaskMapper.toResponse(subtaskRepository.save(subtask));
    }

    @Override
    @Transactional
    public SubtaskResponse toggle(User user, Long taskId, Long subtaskId) {
        Task task = getTaskOrThrow(user, taskId);
        Subtask subtask = getSubtaskOrThrow(task, subtaskId);
        subtask.setDone(!subtask.isDone());
        return subtaskMapper.toResponse(subtaskRepository.save(subtask));
    }

    @Override
    @Transactional
    public void delete(User user, Long taskId, Long subtaskId) {
        Task task = getTaskOrThrow(user, taskId);
        Subtask subtask = getSubtaskOrThrow(task, subtaskId);
        subtaskRepository.delete(subtask);
    }

    private Task getTaskOrThrow(User user, Long taskId) {
        return taskRepository.findById(taskId)
                .filter(t -> t.getUser().getId().equals(user.getId()) && !t.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Tarea", taskId));
    }

    private Subtask getSubtaskOrThrow(Task task, Long subtaskId) {
        return task.getSubtasks().stream()
                .filter(s -> s.getId().equals(subtaskId))
                .findFirst()
                .orElseThrow(() -> new ResourceNotFoundException("Subtarea", subtaskId));
    }
}
