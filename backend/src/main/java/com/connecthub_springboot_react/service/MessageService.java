package com.connecthub_springboot_react.service;

import java.time.Instant;
import java.util.List;

import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import com.connecthub_springboot_react.model.ChatMessage;
import com.connecthub_springboot_react.repository.ChatMessageRepository;

@Service
public class MessageService {

    private final ChatMessageRepository chatMessageRepository;

    public MessageService(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    public ChatMessage saveMessage(String senderId, String receiverId, String content) {
        ChatMessage message = new ChatMessage(
                senderId,
                receiverId,
                content,
                Instant.now(),
                false
        );
        return chatMessageRepository.save(message);
    }

    public List<ChatMessage> getConversation(String userId, String friendId) {
        List<ChatMessage> messages = chatMessageRepository.findConversation(userId, friendId);
        messages.sort((a, b) -> a.getTimestamp().compareTo(b.getTimestamp()));
        return messages;
    }

    public ChatMessage getLatestMessage(String userId, String friendId) {
        List<ChatMessage> latest = chatMessageRepository.findLatestBetween(
                userId,
                friendId,
                PageRequest.of(0, 1)
        );
        return latest.isEmpty() ? null : latest.get(0);
    }

    public long getUnreadCount(String senderId, String receiverId) {
        return chatMessageRepository.countBySenderIdAndReceiverIdAndReadFalse(senderId, receiverId);
    }

    public void markConversationRead(String userId, String friendId) {
        List<ChatMessage> unread = chatMessageRepository.findBySenderIdAndReceiverIdAndReadFalse(
                friendId,
                userId
        );
        if (unread.isEmpty()) return;
        unread.forEach(message -> message.setRead(true));
        chatMessageRepository.saveAll(unread);
    }
}
