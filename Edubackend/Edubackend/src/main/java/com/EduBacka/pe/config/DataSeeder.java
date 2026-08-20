package com.EduBacka.pe.config;

import com.EduBacka.pe.domain.entity.AcademicCycle;
import com.EduBacka.pe.domain.repository.AcademicCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import java.util.ArrayList;
import java.util.List;

import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.enumerate.AuthProvider;
import com.EduBacka.pe.domain.enumerate.UserRole;
import com.EduBacka.pe.domain.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final AcademicCycleRepository cycleRepository;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Override
    public void run(String... args) {
        if (cycleRepository.count() == 0) {
            preloadedCycleNames().forEach(name -> {
                AcademicCycle cycle = AcademicCycle.builder()
                        .name(name)
                        .isPreloaded(true)
                        .build();
                cycleRepository.save(cycle);
            });
            System.out.println("Ciclos académicos inicializados.");
        }

        if (userRepository.findByEmail("admin@edubaka.com").isEmpty()) {
            User admin = User.builder()
                    .fullName("Super Administrador")
                    .email("admin@edubaka.com")
                    .passwordHash(passwordEncoder.encode("eduadmin6152"))
                    .role(UserRole.ADMIN)
                    .authProvider(AuthProvider.LOCAL)
                    .active(true)
                    .build();
            userRepository.save(admin);
            System.out.println("Usuario administrador por defecto creado.");
        }
    }

    // Spec: primer ciclo precargado es 2026-2, luego 0/1/2 por año hasta 2030.
    private static List<String> preloadedCycleNames() {
        List<String> names = new ArrayList<>();
        names.add("2026-2");
        for (int year = 2027; year <= 2030; year++) {
            for (int period = 0; period <= 2; period++) {
                names.add(year + "-" + period);
            }
        }
        return names;
    }
}
