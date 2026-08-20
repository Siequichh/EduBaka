package com.EduBacka.pe.infrastructure.security;

import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTVerificationException;
import com.auth0.jwt.interfaces.DecodedJWT;
import com.EduBacka.pe.domain.enumerate.UserRole;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.Date;
import java.util.UUID;

@Component
public class JwtUtil {

    @Value("${app.security.jwt.secret:defaultSecretKeyEduBaka2024!}")
    private String jwtSecret;

    @Value("${app.security.jwt.expiration-ms:3600000}")
    private int jwtExpirationMs;

    public String generateToken(String email, UserRole role, String fullName) {
        Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
        return JWT.create()
                .withSubject(email)
                .withClaim("role", role.name())
                .withClaim("fullName", fullName)
                .withJWTId(UUID.randomUUID().toString())
                .withIssuedAt(new Date())
                .withExpiresAt(new Date(System.currentTimeMillis() + jwtExpirationMs))
                .sign(algorithm);
    }

    public DecodedJWT validateToken(String token) {
        try {
            Algorithm algorithm = Algorithm.HMAC256(jwtSecret);
            return JWT.require(algorithm)
                    .build()
                    .verify(token);
        } catch (JWTVerificationException exception) {
            return null;
        }
    }

    public String getEmailFromToken(DecodedJWT decodedJWT) {
        return decodedJWT.getSubject();
    }
}
