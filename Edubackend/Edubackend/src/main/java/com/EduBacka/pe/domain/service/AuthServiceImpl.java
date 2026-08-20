package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.auth.JwtResponse;
import com.EduBacka.pe.application.dto.auth.LoginRequest;
import com.EduBacka.pe.application.dto.auth.RefreshRequest;
import com.EduBacka.pe.application.dto.auth.RegisterRequest;
import com.EduBacka.pe.domain.entity.RefreshToken;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import com.EduBacka.pe.domain.enumerate.UserRole;
import com.EduBacka.pe.domain.repository.RefreshTokenRepository;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.infrastructure.exception.BusinessException;
import com.EduBacka.pe.infrastructure.exception.JwtAuthException;
import com.EduBacka.pe.infrastructure.security.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.OffsetDateTime;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class AuthServiceImpl implements AuthService {

    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;

    @Override
    @Transactional
    public JwtResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password())
        );
        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() -> new BusinessException("Usuario no encontrado"));
        
        user.setLastLoginAt(OffsetDateTime.now());
        userRepository.save(user);
        
        return generateTokens(user);
    }

    @Override
    @Transactional
    public JwtResponse register(RegisterRequest request) {
        if (userRepository.findByEmail(request.email()).isPresent()) {
            throw new BusinessException("El email ya está registrado");
        }
        
        User user = User.builder()
                .email(request.email())
                .passwordHash(passwordEncoder.encode(request.password()))
                .fullName(request.fullName())
                .avatarInitials(request.fullName().substring(0, Math.min(2, request.fullName().length())).toUpperCase())
                .authProvider(AuthProvider.LOCAL)
                .role(UserRole.USER)
                .active(true)
                .build();
                
        user = userRepository.save(user);
        return generateTokens(user);
    }

    @Override
    @Transactional
    public JwtResponse refresh(RefreshRequest request) {
        RefreshToken storedToken = refreshTokenRepository.findByToken(request.refreshToken())
                .orElseThrow(() -> new JwtAuthException("Refresh token no encontrado"));
                
        if (storedToken.isRevoked() || storedToken.getExpiresAt().isBefore(OffsetDateTime.now())) {
            refreshTokenRepository.delete(storedToken);
            throw new JwtAuthException("Refresh token expirado o revocado");
        }
        
        User user = storedToken.getUser();
        refreshTokenRepository.delete(storedToken);
        
        return generateTokens(user);
    }

    @Override
    @Transactional
    public void logout(User user) {
        refreshTokenRepository.deleteByUser(user);
    }
    
    @Override
    @Transactional
    public JwtResponse issueTokens(User user) {
        return generateTokens(user);
    }

    private JwtResponse generateTokens(User user) {
        String accessToken = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getFullName());
        
        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(UUID.randomUUID().toString())
                .expiresAt(OffsetDateTime.now().plusDays(7))
                .build();
        refreshTokenRepository.save(refreshToken);
        
        return new JwtResponse(
                accessToken, 
                refreshToken.getToken(),
                user.getEmail(),
                user.getFullName(),
                user.getRole()
        );
    }
}
