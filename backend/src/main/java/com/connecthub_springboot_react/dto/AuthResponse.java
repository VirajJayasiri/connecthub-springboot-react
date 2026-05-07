package com.connecthub_springboot_react.dto;

import java.util.Map;

public class AuthResponse {
    private String message;
    private String token;
    private Map<String, Object> user;

    public AuthResponse() {}

    // Constructor for signup (message only, no token/user)
    public AuthResponse(String message) {
        this.message = message;
    }

    // Constructor for login (message + token + user details)
    public AuthResponse(String message, String token, Map<String, Object> user) {
        this.message = message;
        this.token = token;
        this.user = user;
    }

    // Getters and Setters
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public Map<String, Object> getUser() { return user; }
    public void setUser(Map<String, Object> user) { this.user = user; }
}
