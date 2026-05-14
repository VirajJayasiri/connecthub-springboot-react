package com.connecthub_springboot_react.dto.room;

public class RoomChatSendPayload {
    private String roomId;
    private String content;

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }
}
