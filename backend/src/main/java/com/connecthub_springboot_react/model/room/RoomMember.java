package com.connecthub_springboot_react.model.room;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.index.Indexed;
import org.springframework.data.mongodb.core.mapping.Document;

import java.time.Instant;

@Document(collection = "room_members")
public class RoomMember {

    @Id
    private String id;

    @Indexed
    private String roomId;

    @Indexed
    private String userId;

    private RoomMemberRole role;
    private Instant joinedAt;
    private boolean micEnabled;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public RoomMemberRole getRole() {
        return role;
    }

    public void setRole(RoomMemberRole role) {
        this.role = role;
    }

    public Instant getJoinedAt() {
        return joinedAt;
    }

    public void setJoinedAt(Instant joinedAt) {
        this.joinedAt = joinedAt;
    }

    public boolean isMicEnabled() {
        return micEnabled;
    }

    public void setMicEnabled(boolean micEnabled) {
        this.micEnabled = micEnabled;
    }
}
