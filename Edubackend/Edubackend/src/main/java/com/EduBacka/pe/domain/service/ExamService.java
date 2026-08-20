package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.exam.ExamRequest;
import com.EduBacka.pe.application.dto.exam.ExamResponse;
import com.EduBacka.pe.domain.entity.User;

import java.util.List;

public interface ExamService {
    ExamResponse create(User user, ExamRequest req);
    List<ExamResponse> getByUser(User user);
    List<ExamResponse> getUpcoming(User user);
    ExamResponse update(User user, Long id, ExamRequest req);
    void delete(User user, Long id);
}
