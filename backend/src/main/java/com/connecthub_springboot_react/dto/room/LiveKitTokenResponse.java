package com.connecthub_springboot_react.dto.room;

public class LiveKitTokenResponse {
    private String serverUrl;
    private String roomName;
    private String token;

    public LiveKitTokenResponse() {
    }

    public LiveKitTokenResponse(String serverUrl, String roomName, String token) {
        this.serverUrl = serverUrl;
        this.roomName = roomName;
        this.token = token;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }
}
