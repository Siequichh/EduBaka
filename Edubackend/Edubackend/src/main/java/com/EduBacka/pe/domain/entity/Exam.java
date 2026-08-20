package com.EduBacka.pe.domain.entity;

import com.EduBacka.pe.domain.audit.AuditableEntity;
import com.EduBacka.pe.domain.enumerate.ExamType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;

@Entity
@Table(name = "exams")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Exam extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "course_id")
    private Course course;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.ExamTypeConverter.class)
    @Column(name = "exam_type", nullable = false, length = 2)
    private ExamType examType;

    @Column(name = "exam_date", nullable = false)
    private LocalDateTime examDate;

    @Column(name = "notes", length = 500)
    private String notes;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;
}
