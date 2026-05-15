package com.connecthub_springboot_react.service;

import com.connecthub_springboot_react.dto.room.LiveKitTokenRequest;
import com.connecthub_springboot_react.dto.room.LiveKitTokenResponse;
import com.connecthub_springboot_react.model.room.RoomType;
import org.springframework.stereotype.Service;

@Service
public class LiveKitService {

    private final LiveKitTokenService liveKitTokenService;

    public LiveKitService(LiveKitTokenService liveKitTokenService) {
        this.liveKitTokenService = liveKitTokenService;
    }

    public LiveKitTokenResponse generateToken(LiveKitTokenRequest request) {
        if (request == null) {
            throw new IllegalArgumentException("Request body is required");
        }

        String userId = normalize(request.getUserId());
        if (userId == null) {
            throw new IllegalArgumentException("userId is required");
        }

        String roomId = normalize(request.getRoomId());
        String roomName = normalize(request.getRoomName());
        if (roomId == null && roomName == null) {
            throw new IllegalArgumentException("roomId or roomName is required");
        }

        RoomType type = parseRoomType(normalize(request.getRoomType()));
        if (type != RoomType.VOICE && type != RoomType.VIDEO) {
            throw new IllegalArgumentException("roomType must be VOICE or VIDEO");
        }

        String resolvedRoomName = resolveRoomName(roomId, roomName);
        String displayName = normalize(request.getDisplayName());
        if (displayName == null) {
            displayName = userId;
        }
        if (displayName.length() > 40) {
            displayName = displayName.substring(0, 40);
        }

        return liveKitTokenService.issueToken(userId, displayName, resolvedRoomName, true);
    }

    private RoomType parseRoomType(String roomType) {
        if (roomType == null) {
            throw new IllegalArgumentException("roomType is required");
        }
        try {
            return RoomType.valueOf(roomType.trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new IllegalArgumentException("roomType must be VOICE or VIDEO");
        }
    }

    private String resolveRoomName(String roomId, String roomName) {
        if (roomId != null) {
            return liveKitTokenService.liveKitRoomName(roomId);
        }
        String safe = roomName.replaceAll("[^a-zA-Z0-9_-]", "_");
        if (safe.startsWith("connecthub-room-")) {
            return safe;
        }
        return "connecthub-room-" + safe;
    }

    private String normalize(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }
}
