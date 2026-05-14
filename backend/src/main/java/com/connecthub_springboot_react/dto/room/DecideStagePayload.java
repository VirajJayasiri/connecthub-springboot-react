package com.connecthub_springboot_react.dto.room;

import com.connecthub_springboot_react.model.room.RoomMemberRole;

public class DecideStagePayload {
    private String roomId;
    private String requestId;
    private boolean approve;
    /** When approve=true: SPEAKER or ADMIN */
    private RoomMemberRole promoteRole;

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getRequestId() {
        return requestId;
    }

    public void setRequestId(String requestId) {
        this.requestId = requestId;
    }

    public boolean isApprove() {
        return approve;
    }

    public void setApprove(boolean approve) {
        this.approve = approve;
    }

    public RoomMemberRole getPromoteRole() {
        return promoteRole;
    }

    public void setPromoteRole(RoomMemberRole promoteRole) {
        this.promoteRole = promoteRole;
    }
}
