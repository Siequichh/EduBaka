package com.EduBacka.pe.domain.entity;

import com.EduBacka.pe.domain.audit.AuditableEntity;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import com.EduBacka.pe.domain.enumerate.UserRole;
import jakarta.persistence.*;
import lombok.*;
import lombok.experimental.SuperBuilder;

import java.time.OffsetDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@SuperBuilder
public class User extends AuditableEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "email", length = 150, nullable = false, unique = true)
    private String email;

    @Column(name = "password_hash", length = 255)
    private String passwordHash;

    @Column(name = "full_name", length = 120, nullable = false)
    private String fullName;

    @Column(name = "avatar_url")
    private String avatarUrl;

    @Column(name = "avatar_initials", length = 2)
    private String avatarInitials;

    @Column(name = "university", length = 200)
    private String university;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.UserRoleConverter.class)
    @Column(name = "role", nullable = false, length = 2)
    private UserRole role;

    @Convert(converter = com.EduBacka.pe.infrastructure.util.converter.AuthProviderConverter.class)
    @Column(name = "auth_provider", nullable = false, length = 2)
    private AuthProvider authProvider;

    @Column(name = "google_id", length = 100, unique = true)
    private String googleId;

    @Column(name = "is_active", nullable = false)
    @Builder.Default
    private boolean active = true;

    @Column(name = "last_login_at")
    private OffsetDateTime lastLoginAt;

    @Column(name = "daily_chat_count", nullable = false)
    @Builder.Default
    private int dailyChatCount = 0;

    @Column(name = "chat_count_date")
    private java.time.LocalDate chatCountDate;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<RefreshToken> refreshTokens = new ArrayList<>();

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<Course> courses = new ArrayList<>();
}
