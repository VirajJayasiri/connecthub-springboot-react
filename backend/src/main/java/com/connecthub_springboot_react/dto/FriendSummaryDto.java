package com.connecthub_springboot_react.dto;

public class FriendSummaryDto {

    private String id;
    private String fullName;
    private String username;
    private String profileImage;
    private boolean online;
    private String lastMessage;
    private long unreadCount;

    public FriendSummaryDto() {
    }

    public FriendSummaryDto(
            String id,
            String fullName,
            String username,
            String profileImage,
            boolean online,
            String lastMessage,
            long unreadCount
    ) {
        this.id = id;
        this.fullName = fullName;
        this.username = username;
        this.profileImage = profileImage;
        this.online = online;
        this.lastMessage = lastMessage;
        this.unreadCount = unreadCount;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getUsername() {
        return username;
    }

    public void setUsername(String username) {
        this.username = username;
    }

    public String getProfileImage() {
        return profileImage;
    }

    public void setProfileImage(String profileImage) {
        this.profileImage = profileImage;
    }

    public boolean isOnline() {
        return online;
    }

    public void setOnline(boolean online) {
        this.online = online;
    }

    public String getLastMessage() {
        return lastMessage;
    }

    public void setLastMessage(String lastMessage) {
        this.lastMessage = lastMessage;
    }

    public long getUnreadCount() {
        return unreadCount;
    }

    public void setUnreadCount(long unreadCount) {
        this.unreadCount = unreadCount;
    }
}
