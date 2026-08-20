package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.course.CourseRequest;
import com.EduBacka.pe.application.dto.course.CourseResponse;
import com.EduBacka.pe.domain.entity.User;

import java.util.List;

public interface CourseService {
    CourseResponse create(User user, CourseRequest req);
    List<CourseResponse> getByUser(User user);
    CourseResponse update(User user, Long id, CourseRequest req);
    void delete(User user, Long id);
}
