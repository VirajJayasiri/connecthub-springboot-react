package com.connecthub_springboot_react.dto.room;

public class LiveKitTokenResponse {
    private String serverUrl;
    private String roomName;
    private String token;
    private String identity;
    private String name;

    public LiveKitTokenResponse() {
    }

    public LiveKitTokenResponse(String serverUrl, String roomName, String token) {
        this.serverUrl = serverUrl;
        this.roomName = roomName;
        this.token = token;
    }

    public LiveKitTokenResponse(String serverUrl, String roomName, String token, String identity, String name) {
        this.serverUrl = serverUrl;
        this.roomName = roomName;
        this.token = token;
        this.identity = identity;
        this.name = name;
    }

    public String getServerUrl() {
        return serverUrl;
    }

    public void setServerUrl(String serverUrl) {
        this.serverUrl = serverUrl;
    }

    public String getUrl() {
        return serverUrl;
    }

    public void setUrl(String url) {
        this.serverUrl = url;
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

    public String getIdentity() {
        return identity;
    }

    public void setIdentity(String identity) {
        this.identity = identity;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }
}
