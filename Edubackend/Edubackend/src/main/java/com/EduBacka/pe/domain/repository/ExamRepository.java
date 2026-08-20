package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.Exam;
import com.EduBacka.pe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ExamRepository extends JpaRepository<Exam, Long> {
    List<Exam> findByUserAndIsDeletedFalse(User user);
}
