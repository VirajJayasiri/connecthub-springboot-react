package com.connecthub_springboot_react.dto;

import jakarta.validation.constraints.NotBlank;

public class CreateCommentRequest {

    @NotBlank(message = "Comment content is required")
    private String content;

    public CreateCommentRequest() {
    }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
}
