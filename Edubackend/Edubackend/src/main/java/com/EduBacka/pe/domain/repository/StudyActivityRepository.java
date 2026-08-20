package com.EduBacka.pe.domain.repository;

import com.EduBacka.pe.domain.entity.StudyActivity;
import com.EduBacka.pe.domain.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.sql.Date;
import java.util.List;

@Repository
public interface StudyActivityRepository extends JpaRepository<StudyActivity, Long> {
    List<StudyActivity> findByUserOrderByCreatedAtDesc(User user);

    @Query("select distinct cast(a.createdAt as date) from StudyActivity a where a.user = :user order by 1 desc")
    List<Date> findDistinctActivityDates(@Param("user") User user);
}
