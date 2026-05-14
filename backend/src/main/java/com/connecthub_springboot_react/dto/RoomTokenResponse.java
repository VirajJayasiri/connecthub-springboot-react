package com.connecthub_springboot_react.dto;

public class RoomTokenResponse {
    private String token;
    private String serverUrl;

    public RoomTokenResponse(String token, String serverUrl) {
        this.token = token;
        this.serverUrl = serverUrl;
    }

    public String getToken() { return token; }
    public String getServerUrl() { return serverUrl; }
}
