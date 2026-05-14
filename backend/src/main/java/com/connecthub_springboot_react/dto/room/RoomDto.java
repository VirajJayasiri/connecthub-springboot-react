package com.connecthub_springboot_react.dto.room;

import com.connecthub_springboot_react.model.room.RoomMemberRole;
import com.connecthub_springboot_react.model.room.RoomType;

import java.time.Instant;

public class RoomDto {
    private String id;
    private String name;
    private String description;
    private RoomType type;
    private String hostUserId;
    private Instant createdAt;
    private long memberCount;
    private RoomMemberRole myRole;

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public RoomType getType() {
        return type;
    }

    public void setType(RoomType type) {
        this.type = type;
    }

    public String getHostUserId() {
        return hostUserId;
    }

    public void setHostUserId(String hostUserId) {
        this.hostUserId = hostUserId;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Instant createdAt) {
        this.createdAt = createdAt;
    }

    public long getMemberCount() {
        return memberCount;
    }

    public void setMemberCount(long memberCount) {
        this.memberCount = memberCount;
    }

    public RoomMemberRole getMyRole() {
        return myRole;
    }

    public void setMyRole(RoomMemberRole myRole) {
        this.myRole = myRole;
    }
}
