package com.connecthub_springboot_react.model.room;

public enum RoomMemberRole {
    HOST,
    ADMIN,
    SPEAKER,
    /** Voice/video: listen-only floor member */
    AUDIENCE,
    /** Text room: regular member */
    MEMBER
}
