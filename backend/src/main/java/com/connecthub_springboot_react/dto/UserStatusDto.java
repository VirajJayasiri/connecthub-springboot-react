package com.connecthub_springboot_react.dto;

public class UserStatusDto {

    private String userId;
    private boolean online;

    public UserStatusDto() {
    }

    public UserStatusDto(String userId, boolean online) {
        this.userId = userId;
        this.online = online;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }
}
