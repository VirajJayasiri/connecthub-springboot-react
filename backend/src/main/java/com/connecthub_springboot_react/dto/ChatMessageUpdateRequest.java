package com.connecthub_springboot_react.dto;

public class ChatMessageUpdateRequest {

    private String content;

    public ChatMessageUpdateRequest() {
    }

    public ChatMessageUpdateRequest(String content) {
        this.content = content;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
