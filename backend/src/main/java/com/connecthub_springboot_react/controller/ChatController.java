package com.connecthub_springboot_react.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connecthub_springboot_react.dto.ChatMessageDto;
import com.connecthub_springboot_react.model.ChatMessage;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.service.MessageService;
import com.connecthub_springboot_react.service.UserService;

@RestController
@RequestMapping("/api/messages")
public class ChatController {

    private final MessageService messageService;
    private final UserService userService;

    public ChatController(MessageService messageService, UserService userService) {
        this.messageService = messageService;
        this.userService = userService;
    }

    @GetMapping("/{friendId}")
    public ResponseEntity<List<ChatMessageDto>> getMessages(
            Authentication authentication,
            @PathVariable String friendId
    ) {
        User currentUser = userService.getByEmail(authentication.getName());
        List<ChatMessage> messages = messageService.getConversation(currentUser.getId(), friendId);
        messageService.markConversationRead(currentUser.getId(), friendId);

        List<ChatMessageDto> response = messages.stream()
                .map(message -> new ChatMessageDto(
                        message.getId(),
                        message.getSenderId(),
                        message.getReceiverId(),
                        message.getContent(),
                        message.getTimestamp()
                ))
                .toList();

        return ResponseEntity.ok(response);
    }
}
