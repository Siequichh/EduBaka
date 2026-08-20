package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.Course;
import com.EduBacka.pe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CourseRepository extends JpaRepository<Course, Long> {
    List<Course> findByUserAndIsDeletedFalse(User user);
}
