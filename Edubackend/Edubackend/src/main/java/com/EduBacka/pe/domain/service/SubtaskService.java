package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.subtask.SubtaskRequest;
import com.EduBacka.pe.application.dto.subtask.SubtaskResponse;
import com.EduBacka.pe.domain.entity.User;

public interface SubtaskService {
    SubtaskResponse create(User user, Long taskId, SubtaskRequest request);
    SubtaskResponse toggle(User user, Long taskId, Long subtaskId);
    void delete(User user, Long taskId, Long subtaskId);
}
