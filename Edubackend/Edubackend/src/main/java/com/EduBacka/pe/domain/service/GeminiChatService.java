package com.EduBacka.pe.domain.service;

import com.EduBacka.pe.application.dto.chat.ChatRequest;
import com.EduBacka.pe.application.dto.chat.ChatResponse;
import com.EduBacka.pe.domain.entity.User;

public interface GeminiChatService {
    ChatResponse ask(User user, ChatRequest request);
}
