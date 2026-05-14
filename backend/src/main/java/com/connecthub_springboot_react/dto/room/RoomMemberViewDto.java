package com.connecthub_springboot_react.dto.room;

import com.connecthub_springboot_react.model.room.RoomMemberRole;

public class RoomMemberViewDto {
    private String userId;
    private String displayName;
    private RoomMemberRole role;
    private boolean micEnabled;

    public RoomMemberViewDto() {
    }

    public RoomMemberViewDto(String userId, String displayName, RoomMemberRole role, boolean micEnabled) {
        this.userId = userId;
        this.displayName = displayName;
        this.role = role;
        this.micEnabled = micEnabled;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public String getDisplayName() {
        return displayName;
    }

    public void setDisplayName(String displayName) {
        this.displayName = displayName;
    }

    public RoomMemberRole getRole() {
        return role;
    }

    public void setRole(RoomMemberRole role) {
        this.role = role;
    }

    public boolean isMicEnabled() {
        return micEnabled;
    }

    public void setMicEnabled(boolean micEnabled) {
        this.micEnabled = micEnabled;
    }
}
