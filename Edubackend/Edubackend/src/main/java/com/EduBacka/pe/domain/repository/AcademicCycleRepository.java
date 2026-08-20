package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.AcademicCycle;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface AcademicCycleRepository extends JpaRepository<AcademicCycle, Long> {
    Optional<AcademicCycle> findByName(String name);
}
