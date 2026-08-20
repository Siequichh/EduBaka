package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.exam.ExamRequest;
import com.EduBacka.pe.application.dto.exam.ExamResponse;
import com.EduBacka.pe.domain.entity.Course;
import com.EduBacka.pe.domain.entity.Exam;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.CourseRepository;
import com.EduBacka.pe.domain.repository.ExamRepository;
import com.EduBacka.pe.infrastructure.exception.BusinessException;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.ExamMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ExamServiceImpl implements ExamService {

    private final ExamRepository examRepository;
    private final CourseRepository courseRepository;
    private final ExamMapper examMapper;

    @Override
    @Transactional
    public ExamResponse create(User user, ExamRequest req) {
        Course course = courseRepository.findById(req.courseId())
                .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", req.courseId()));

        Exam exam = Exam.builder()
                .user(user).course(course)
                .title(req.title())
                .examType(req.examType())
                .examDate(req.examDate())
                .notes(req.notes())
                .isDeleted(false)
                .build();
        return examMapper.toResponse(examRepository.save(exam));
    }

    @Override
    public List<ExamResponse> getByUser(User user) {
        return examRepository.findByUserAndIsDeletedFalse(user).stream()
                .map(examMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    public List<ExamResponse> getUpcoming(User user) {
        LocalDateTime now = LocalDateTime.now();
        return examRepository.findByUserAndIsDeletedFalse(user).stream()
                .filter(exam -> exam.getExamDate().isAfter(now))
                .map(examMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public ExamResponse update(User user, Long id, ExamRequest req) {
        Exam exam = examRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()) && !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Examen", id));

        Course course = courseRepository.findById(req.courseId())
                .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", req.courseId()));

        exam.setCourse(course);
        exam.setTitle(req.title());
        exam.setExamType(req.examType());
        exam.setExamDate(req.examDate());
        exam.setNotes(req.notes());

        return examMapper.toResponse(examRepository.save(exam));
    }

    @Override
    @Transactional
    public void delete(User user, Long id) {
        Exam exam = examRepository.findById(id)
                .filter(e -> e.getUser().getId().equals(user.getId()) && !e.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Examen", id));
        exam.setDeleted(true);
        examRepository.save(exam);
    }
}
