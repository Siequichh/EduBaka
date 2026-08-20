package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.chat.ChatRequest;
import com.EduBacka.pe.application.dto.chat.ChatResponse;
import com.EduBacka.pe.application.dto.chat.ChatTurn;
import com.EduBacka.pe.domain.entity.User;
import com.EduBacka.pe.domain.repository.UserRepository;
import com.EduBacka.pe.infrastructure.exception.BusinessException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClient;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Slf4j
@Service
@RequiredArgsConstructor
public class GeminiChatServiceImpl implements GeminiChatService {

    private static final String SYSTEM_PREAMBLE =
            "Eres el asistente de EduBaka, una app de estudio para universitarios. " +
            "Responde en español, de forma breve y directa (máximo 3-4 oraciones), solo a preguntas de estudio. " +
            "No uses LaTeX ni símbolos como $, \\, ^{} o \\cdot: escribe fórmulas y potencias en texto plano " +
            "(por ejemplo 2^3 o 2 elevado a 3, x*y en vez de x \\cdot y).";

    private static final int MAX_HISTORY_TURNS = 10;

    private final RestClient restClient = RestClient.create();
    private final UserRepository userRepository;

    @Value("${gemini.api-key}")
    private String apiKey;

    @Value("${gemini.model}")
    private String model;

    @Value("${app.chat.daily-limit:30}")
    private int dailyLimit;

    @Override
    @Transactional
    public ChatResponse ask(User user, ChatRequest request) {
        if (apiKey == null || apiKey.isBlank()) {
            throw new BusinessException("El chat no está configurado en este momento", HttpStatus.SERVICE_UNAVAILABLE);
        }

        int remaining = consumeQuota(user);

        Map<String, Object> body = Map.of(
                "systemInstruction", Map.of("parts", List.of(Map.of("text", SYSTEM_PREAMBLE))),
                "contents", buildContents(request)
        );

        return new ChatResponse(extractReply(callGeminiWithRetry(body)), remaining);
    }

    private List<Map<String, Object>> buildContents(ChatRequest request) {
        List<ChatTurn> history = request.history() == null ? List.of() : request.history();
        int from = Math.max(0, history.size() - MAX_HISTORY_TURNS);

        List<Map<String, Object>> contents = new ArrayList<>();
        for (ChatTurn turn : history.subList(from, history.size())) {
            contents.add(Map.of("role", turn.role(), "parts", List.of(Map.of("text", turn.text()))));
        }
        contents.add(Map.of("role", "user", "parts", List.of(Map.of("text", request.message()))));
        return contents;
    }

    // Gemini returns 503 when the model is momentarily overloaded on Google's side -
    // a couple of short retries clears most of these without the user having to resend.
    private Map<String, Object> callGeminiWithRetry(Map<String, Object> body) {
        int maxAttempts = 3;
        for (int attempt = 1; attempt <= maxAttempts; attempt++) {
            try {
                return restClient.post()
                        .uri("https://generativelanguage.googleapis.com/v1beta/models/{model}:generateContent?key={key}", model, apiKey)
                        .body(body)
                        .retrieve()
                        .body(Map.class);
            } catch (HttpServerErrorException.ServiceUnavailable e) {
                if (attempt == maxAttempts) {
                    log.error("Gemini sigue sobrecargado tras {} intentos", maxAttempts);
                    throw new BusinessException("El chat está saturado en este momento, intenta de nuevo en un minuto", HttpStatus.SERVICE_UNAVAILABLE);
                }
                log.warn("Gemini 503 (intento {}/{}), reintentando...", attempt, maxAttempts);
                sleep(500L * attempt);
            } catch (org.springframework.web.client.HttpClientErrorException.TooManyRequests e) {
                // Free-tier daily quota exhausted for this model - retrying won't help, and it's
                // shared across every user of this API key, not per-account.
                log.error("Cuota gratuita de Gemini agotada: {}", e.getMessage());
                throw new BusinessException("Se alcanzó el límite gratuito de Gemini por hoy, vuelve a intentarlo más tarde", HttpStatus.TOO_MANY_REQUESTS);
            } catch (Exception e) {
                log.error("Fallo al llamar a Gemini: {}", e.getMessage());
                throw new BusinessException("No se pudo obtener respuesta del chat, intenta de nuevo", HttpStatus.BAD_GATEWAY);
            }
        }
        throw new BusinessException("No se pudo obtener respuesta del chat, intenta de nuevo", HttpStatus.BAD_GATEWAY);
    }

    private static void sleep(long millis) {
        try {
            Thread.sleep(millis);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
        }
    }

    private int consumeQuota(User user) {
        LocalDate today = LocalDate.now();
        if (!today.equals(user.getChatCountDate())) {
            user.setChatCountDate(today);
            user.setDailyChatCount(0);
        }
        if (user.getDailyChatCount() >= dailyLimit) {
            throw new BusinessException("Límite diario de chat alcanzado, vuelve mañana", HttpStatus.TOO_MANY_REQUESTS);
        }
        user.setDailyChatCount(user.getDailyChatCount() + 1);
        userRepository.save(user);
        return dailyLimit - user.getDailyChatCount();
    }

    @SuppressWarnings("unchecked")
    private String extractReply(Map<String, Object> response) {
        try {
            List<Object> candidates = (List<Object>) response.get("candidates");
            Map<String, Object> first = (Map<String, Object>) candidates.get(0);
            Map<String, Object> content = (Map<String, Object>) first.get("content");
            List<Object> parts = (List<Object>) content.get("parts");
            Map<String, Object> part = (Map<String, Object>) parts.get(0);
            return (String) part.get("text");
        } catch (Exception e) {
            throw new BusinessException("Respuesta de chat no disponible, intenta de nuevo", HttpStatus.BAD_GATEWAY);
        }
    }
}
