package com.EduBacka.pe.domain.entity;

import com.EduBacka.pe.domain.audit.AuditableEntity;
import com.EduBacka.pe.domain.enumerate.TaskPriority;
import com.EduBacka.pe.domain.enumerate.TaskStatus;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "tasks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class Task extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id")
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id")
    private Course course;

    @Column(name = "title", nullable = false, length = 200)
    private String title;

    @Column(name = "description", length = 1000)
    private String description;

    @Column(name = "due_date")
    private LocalDateTime dueDate;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.TaskPriorityConverter.class)
    @Column(name = "priority", nullable = false, length = 2)
    private TaskPriority priority;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.TaskStatusConverter.class)
    @Column(name = "status", nullable = false, length = 2)
    private TaskStatus status;

    @Column(name = "estimated_pomodoros")
    private Integer estimatedPomodoros;

    @Column(name = "completed_pomodoros", nullable = false)
    @Builder.Default
    private int completedPomodoros = 0;

    @Column(name = "is_deleted", nullable = false)
    @Builder.Default
    private boolean isDeleted = false;

    @OneToMany(mappedBy = "task", cascade = CascadeType.ALL, orphanRemoval = true)
    @OrderBy("position asc")
    @Builder.Default
    private List<Subtask> subtasks = new ArrayList<>();
}
