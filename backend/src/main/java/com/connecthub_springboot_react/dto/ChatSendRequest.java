package com.connecthub_springboot_react.dto;

public class ChatSendRequest {

    private String receiverId;
    private String content;

    public ChatSendRequest() {
    }

    public ChatSendRequest(String receiverId, String content) {
        this.receiverId = receiverId;
        this.content = content;
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
}
