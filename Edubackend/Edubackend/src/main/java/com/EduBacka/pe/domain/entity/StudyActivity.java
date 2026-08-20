package com.EduBacka.pe.domain.entity;

import com.EduBacka.pe.domain.audit.AuditableEntity;
import com.EduBacka.pe.domain.enumerate.ActivityType;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

@Entity
@Table(name = "study_activities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class StudyActivity extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.ActivityTypeConverter.class)
    @Column(name = "activity_type", nullable = false, length = 2)
    private ActivityType activityType;

    @Column(name = "description", length = 500)
    private String description;

    @Column(name = "points_earned", nullable = false)
    @Builder.Default
    private int pointsEarned = 0;
}
