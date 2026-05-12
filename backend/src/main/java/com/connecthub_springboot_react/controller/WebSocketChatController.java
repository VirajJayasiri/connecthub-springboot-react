package com.connecthub_springboot_react.controller;

import java.security.Principal;

import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import com.connecthub_springboot_react.dto.ChatMessageDto;
import com.connecthub_springboot_react.dto.ChatSendRequest;
import com.connecthub_springboot_react.model.ChatMessage;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.MessageService;

@Controller
public class WebSocketChatController {

    private final MessageService messageService;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketChatController(
            MessageService messageService,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate
    ) {
        this.messageService = messageService;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatSendRequest request, Principal principal) {
        if (principal == null || request == null || request.getReceiverId() == null) {
            return;
        }

        String senderId = principal.getName();
        if (senderId.equals(request.getReceiverId())) {
            return;
        }

        if (!userRepository.existsById(request.getReceiverId())) {
            return;
        }

        String content = request.getContent() == null ? "" : request.getContent().trim();
        if (content.isEmpty()) {
            return;
        }

        ChatMessage saved = messageService.saveMessage(senderId, request.getReceiverId(), content);
        ChatMessageDto payload = new ChatMessageDto(
                saved.getId(),
                saved.getSenderId(),
                saved.getReceiverId(),
                saved.getContent(),
            saved.getTimestamp(),
            saved.isRead()
        );

        messagingTemplate.convertAndSendToUser(request.getReceiverId(), "/queue/messages", payload);
        messagingTemplate.convertAndSendToUser(senderId, "/queue/messages", payload);
    }
}
