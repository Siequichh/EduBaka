package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.PomodoroSession;
import com.EduBacka.pe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PomodoroSessionRepository extends JpaRepository<PomodoroSession, Long> {
    List<PomodoroSession> findByUserOrderByStartTimeDesc(User user);
}
