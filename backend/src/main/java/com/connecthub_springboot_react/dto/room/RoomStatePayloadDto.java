package com.connecthub_springboot_react.dto.room;

import java.util.List;

public class RoomStatePayloadDto {
    private List<RoomMemberViewDto> stage;
    private List<RoomMemberViewDto> audience;
    private List<StageRequestViewDto> pendingRequests;

    public List<RoomMemberViewDto> getStage() {
        return stage;
    }

    public void setStage(List<RoomMemberViewDto> stage) {
        this.stage = stage;
    }

    public List<RoomMemberViewDto> getAudience() {
        return audience;
    }

    public void setAudience(List<RoomMemberViewDto> audience) {
        this.audience = audience;
    }

    public List<StageRequestViewDto> getPendingRequests() {
        return pendingRequests;
    }

    public void setPendingRequests(List<StageRequestViewDto> pendingRequests) {
        this.pendingRequests = pendingRequests;
    }
}
