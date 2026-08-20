package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.course.CourseRequest;
import com.EduBacka.pe.application.dto.course.CourseResponse;
import com.EduBacka.pe.domain.entity.AcademicCycle;
import com.EduBacka.pe.domain.entity.Course;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.AcademicCycleRepository;
import com.EduBacka.pe.domain.repository.CourseRepository;
import com.EduBacka.pe.infrastructure.exception.ResourceNotFoundException;
import com.EduBacka.pe.infrastructure.mapper.CourseMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class CourseServiceImpl implements CourseService {

    private final CourseRepository courseRepository;
    private final AcademicCycleRepository cycleRepository;
    private final CourseMapper courseMapper;

    @Override
    @Transactional
    public CourseResponse create(User user, CourseRequest req) {
        AcademicCycle cycle = cycleRepository.findById(req.cycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciclo académico", req.cycleId()));
        Course course = Course.builder()
                .user(user).cycle(cycle)
                .name(req.name()).color(req.color())
                .cycleStart(req.cycleStart()).cycleEnd(req.cycleEnd())
                .isDeleted(false)
                .build();
        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    public List<CourseResponse> getByUser(User user) {
        return courseRepository.findByUserAndIsDeletedFalse(user).stream()
                .map(courseMapper::toResponse)
                .collect(Collectors.toList());
    }

    @Override
    @Transactional
    public CourseResponse update(User user, Long id, CourseRequest req) {
        Course course = courseRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));

        AcademicCycle cycle = cycleRepository.findById(req.cycleId())
                .orElseThrow(() -> new ResourceNotFoundException("Ciclo académico", req.cycleId()));

        course.setName(req.name());
        course.setColor(req.color());
        course.setCycle(cycle);
        course.setCycleStart(req.cycleStart());
        course.setCycleEnd(req.cycleEnd());

        return courseMapper.toResponse(courseRepository.save(course));
    }

    @Override
    @Transactional
    public void delete(User user, Long id) {
        Course course = courseRepository.findById(id)
                .filter(c -> c.getUser().getId().equals(user.getId()) && !c.isDeleted())
                .orElseThrow(() -> new ResourceNotFoundException("Curso", id));
        course.setDeleted(true);
        courseRepository.save(course);
    }
}
