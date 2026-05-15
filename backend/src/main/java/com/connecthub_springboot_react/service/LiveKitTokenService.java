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
        return "chub_" + mongoRoomId.replaceAll("[^a-zA-Z0-9_-]", "_");
    }

    public LiveKitTokenResponse issueToken(String userId, String displayName, String mongoRoomId, boolean canPublish) {
        String lkRoom = liveKitRoomName(mongoRoomId);

        AccessToken token = new AccessToken(apiKey, apiSecret);
        token.setIdentity(userId);
        token.setName(displayName != null ? displayName : userId);
        token.setTtl(60 * 60 * 1000L);

        token.addGrants(
                new RoomJoin(true),
                new RoomName(lkRoom),
                new CanPublish(canPublish),
                new CanSubscribe(true)
        );

        return new LiveKitTokenResponse(livekitUrl, lkRoom, token.toJwt());
    }
}
