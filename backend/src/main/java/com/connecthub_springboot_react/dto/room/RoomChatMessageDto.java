package com.connecthub_springboot_react.dto.room;

public class RoomChatMessageDto {
    private String senderId;
    private String senderName;
    private String content;
    private long timestamp;

    public RoomChatMessageDto() {
    }

    public RoomChatMessageDto(String senderId, String senderName, String content, long timestamp) {
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.timestamp = timestamp;
    }

    public String getSenderId() {
        return senderId;
    }

    public void setSenderId(String senderId) {
        this.senderId = senderId;
    }

    public String getSenderName() {
        return senderName;
    }

    public void setSenderName(String senderName) {
        this.senderName = senderName;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }
}
