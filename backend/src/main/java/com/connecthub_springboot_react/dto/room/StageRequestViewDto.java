package com.connecthub_springboot_react.dto.room;

public class StageRequestViewDto {
    private String id;
    private String userId;
    private String displayName;

    public StageRequestViewDto() {
    }

    public StageRequestViewDto(String id, String userId, String displayName) {
        this.id = id;
        this.userId = userId;
        this.displayName = displayName;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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
}
