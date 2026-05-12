package com.connecthub_springboot_react.dto;

import java.time.Instant;

public class ChatMessageDto {

    private String id;
    private String senderId;
    private String receiverId;
    private String content;
    private Instant timestamp;
    private boolean read;

    public ChatMessageDto() {
    }

    public ChatMessageDto(
            String id,
            String senderId,
            String receiverId,
            String content,
            Instant timestamp,
            boolean read
    ) {
        this.id = id;
        this.senderId = senderId;
        this.receiverId = receiverId;
        this.content = content;
        this.timestamp = timestamp;
        this.read = read;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getReceiverId() {
        return receiverId;
    }

    public void setReceiverId(String receiverId) {
        this.receiverId = receiverId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Instant getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(Instant timestamp) {
        this.timestamp = timestamp;
    }

    public boolean isRead() {
        return read;
    }

    public void setRead(boolean read) {
        this.read = read;
    }
}
