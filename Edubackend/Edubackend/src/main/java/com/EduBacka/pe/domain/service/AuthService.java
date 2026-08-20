package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.auth.JwtResponse;
import com.EduBacka.pe.application.dto.auth.LoginRequest;
import com.EduBacka.pe.application.dto.auth.RefreshRequest;
import com.EduBacka.pe.application.dto.auth.RegisterRequest;
import com.EduBacka.pe.domain.entity.User;

public interface AuthService {
    JwtResponse login(LoginRequest request);
    JwtResponse register(RegisterRequest request);
    JwtResponse refresh(RefreshRequest request);
    void logout(User user);
    JwtResponse issueTokens(User user);
}
