package com.EduBacka.pe.infrastructure.controller;

import com.EduBacka.pe.application.dto.cycle.CycleResponse;
import com.EduBacka.pe.domain.repository.AcademicCycleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/cycles")
@RequiredArgsConstructor
public class CycleController {

    private final AcademicCycleRepository cycleRepository;

    @GetMapping
    public ResponseEntity<List<CycleResponse>> getCycles() {
        return ResponseEntity.ok(cycleRepository.findAll().stream()
                .map(CycleResponse::from)
                .collect(Collectors.toList()));
    }
}
