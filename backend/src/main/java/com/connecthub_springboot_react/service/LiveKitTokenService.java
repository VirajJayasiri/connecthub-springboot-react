package com.connecthub_springboot_react.service;

import com.connecthub_springboot_react.dto.room.LiveKitTokenResponse;
import io.livekit.server.AccessToken;
import io.livekit.server.CanPublish;
import io.livekit.server.CanSubscribe;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

@Service
public class LiveKitTokenService {

    @Value("${livekit.url:ws://127.0.0.1:7880}")
    private String livekitUrl;

    @Value("${livekit.api.key:devkey}")
    private String apiKey;

    @Value("${livekit.api.secret:secret}")
    private String apiSecret;

    public String liveKitRoomName(String mongoRoomId) {
        String safe = mongoRoomId == null ? "" : mongoRoomId.replaceAll("[^a-zA-Z0-9_-]", "_");
        return "connecthub-room-" + safe;
    }

    public LiveKitTokenResponse issueToken(String userId, String displayName, String roomName, boolean canPublish) {
        String resolvedName = displayName == null || displayName.isBlank() ? userId : displayName.trim();
        if (resolvedName.length() > 40) {
            resolvedName = resolvedName.substring(0, 40);
        }
        AccessToken token = new AccessToken(apiKey, apiSecret);
        token.setIdentity(userId);
        token.setName(resolvedName);
        token.setTtl(3600L); // 1 hour in seconds

        token.addGrants(
                new RoomJoin(true),
                new RoomName(roomName),
                new CanPublish(canPublish),
                new CanSubscribe(true)
        );

            LiveKitTokenResponse response = new LiveKitTokenResponse(livekitUrl, roomName, token.toJwt());
            response.setIdentity(userId);
            response.setName(resolvedName);
            return response;
    }
}
