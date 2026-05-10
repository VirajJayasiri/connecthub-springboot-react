package com.connecthub_springboot_react.dto;

import jakarta.validation.constraints.NotBlank;

public class ReactionRequest {

    @NotBlank(message = "Reaction type is required")
    private String type;   // LIKE, LOVE, HAHA, WOW, SAD, ANGRY

    public ReactionRequest() {
    }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
