package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.Task;
import com.EduBacka.pe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {
    List<Task> findByUserAndIsDeletedFalse(User user);
    List<Task> findByUserAndCourseIdAndIsDeletedFalse(User user, Long courseId);
    List<Task> findByUserAndIsDeletedTrue(User user);
}
