package com.connecthub_springboot_react.service;

<<<<<<< Updated upstream
import com.connecthub_springboot_react.dto.room.*;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.model.room.*;
import com.connecthub_springboot_react.repository.RoomMemberRepository;
import com.connecthub_springboot_react.repository.RoomRepository;
import com.connecthub_springboot_react.repository.StageRequestRepository;
import com.connecthub_springboot_react.repository.UserRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;
=======
import com.connecthub_springboot_react.config.LiveKitConfig;
import com.connecthub_springboot_react.model.ChatRoom;
import com.connecthub_springboot_react.repository.ChatRoomRepository;
import io.livekit.server.AccessToken;
import io.livekit.server.VideoGrant;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
>>>>>>> Stashed changes

@Service
public class RoomService {

<<<<<<< Updated upstream
    public static final String EVENT_CHAT = "CHAT_MESSAGE";
    public static final String EVENT_STATE = "ROOM_STATE";
    public static final String EVENT_LIVEKIT_REFRESH = "LIVEKIT_REFRESH";

    private final RoomRepository roomRepository;
    private final RoomMemberRepository roomMemberRepository;
    private final StageRequestRepository stageRequestRepository;
    private final UserRepository userRepository;
    private final SimpMessagingTemplate messagingTemplate;
    private final LiveKitTokenService liveKitTokenService;

    public RoomService(
            RoomRepository roomRepository,
            RoomMemberRepository roomMemberRepository,
            StageRequestRepository stageRequestRepository,
            UserRepository userRepository,
            SimpMessagingTemplate messagingTemplate,
            LiveKitTokenService liveKitTokenService) {
        this.roomRepository = roomRepository;
        this.roomMemberRepository = roomMemberRepository;
        this.stageRequestRepository = stageRequestRepository;
        this.userRepository = userRepository;
        this.messagingTemplate = messagingTemplate;
        this.liveKitTokenService = liveKitTokenService;
    }

    public RoomDto createRoom(String userId, CreateRoomRequest req) {
        if (req.getName() == null || req.getName().isBlank()) {
            throw new IllegalArgumentException("Room name required");
        }
        if (req.getType() == null || req.getType().isBlank()) {
            throw new IllegalArgumentException("Room type required");
        }
        RoomType type;
        try {
            type = RoomType.valueOf(req.getType().trim().toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid room type");
        }
        if (type == RoomType.VIDEO) {
            throw new IllegalArgumentException("Video rooms are not enabled yet");
        }
        Room room = new Room();
        room.setName(req.getName().trim());
        room.setDescription(req.getDescription() == null ? "" : req.getDescription().trim());
        room.setType(type);
        room.setHostUserId(userId);
        room.setCreatedAt(Instant.now());
        room = roomRepository.save(room);

        RoomMember host = new RoomMember();
        host.setRoomId(room.getId());
        host.setUserId(userId);
        host.setRole(RoomMemberRole.HOST);
        host.setJoinedAt(Instant.now());
        host.setMicEnabled(false);
        roomMemberRepository.save(host);

        return toDto(room, userId);
    }

    public List<RoomDto> listRooms(String currentUserId) {
        return roomRepository.findAll().stream()
                .sorted(Comparator.comparing(Room::getCreatedAt).reversed())
                .map(r -> toDto(r, currentUserId))
                .collect(Collectors.toList());
    }

    public RoomDto joinRoom(String roomId, String userId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        Optional<RoomMember> existing = roomMemberRepository.findByRoomIdAndUserId(roomId, userId);
        if (existing.isPresent()) {
            return toDto(room, userId);
        }

        RoomMember member = new RoomMember();
        member.setRoomId(roomId);
        member.setUserId(userId);
        member.setJoinedAt(Instant.now());
        member.setMicEnabled(false);

        if (userId.equals(room.getHostUserId())) {
            member.setRole(RoomMemberRole.HOST);
        } else if (room.getType() == RoomType.TEXT) {
            member.setRole(RoomMemberRole.MEMBER);
        } else if (room.getType() == RoomType.VOICE) {
            member.setRole(RoomMemberRole.AUDIENCE);
        } else {
            member.setRole(RoomMemberRole.AUDIENCE);
        }

        roomMemberRepository.save(member);
        broadcastState(roomId, List.of(userId));
        return toDto(room, userId);
    }

    public RoomStatePayloadDto getState(String roomId) {
        return buildState(roomId);
    }

    public LiveKitTokenResponse liveKitToken(String roomId, String userId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (room.getType() != RoomType.VOICE) {
            throw new IllegalStateException("LiveKit only for voice rooms");
        }
        RoomMember member = roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new IllegalStateException("Join room first"));
        User user = userRepository.findById(userId).orElseThrow();
        String display = user.getFullName() != null ? user.getFullName() : user.getUsername();
        return liveKitTokenService.issueToken(userId, display, roomId, member.getRole());
    }

    public void sendRoomChat(String roomId, String userId, String content) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (room.getType() == RoomType.VIDEO) {
            throw new IllegalStateException("Video rooms not enabled yet");
        }
        roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new IllegalStateException("Join room first"));

        String trimmed = content == null ? "" : content.trim();
        if (trimmed.isEmpty()) {
            return;
        }

        User user = userRepository.findById(userId).orElseThrow();
        String name = user.getFullName() != null && !user.getFullName().isBlank()
                ? user.getFullName()
                : user.getUsername();

        RoomChatMessageDto msg = new RoomChatMessageDto(
                userId,
                name,
                trimmed,
                System.currentTimeMillis()
        );
        messagingTemplate.convertAndSend(topic(roomId), new RoomEventDto(EVENT_CHAT, msg));
    }

    public void raiseHand(String roomId, String userId) {
        Room room = roomRepository.findById(roomId).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (room.getType() != RoomType.VOICE) {
            throw new IllegalStateException("Raise hand only in voice rooms");
        }
        RoomMember self = roomMemberRepository.findByRoomIdAndUserId(roomId, userId)
                .orElseThrow(() -> new IllegalStateException("Join room first"));
        if (self.getRole() != RoomMemberRole.AUDIENCE) {
            throw new IllegalStateException("Only audience can request stage");
        }
        if (stageRequestRepository.findByRoomIdAndUserIdAndStatus(roomId, userId, StageRequestStatus.PENDING).isPresent()) {
            throw new IllegalStateException("Request already pending");
        }

        StageRequest req = new StageRequest();
        req.setRoomId(roomId);
        req.setUserId(userId);
        req.setStatus(StageRequestStatus.PENDING);
        req.setCreatedAt(Instant.now());
        stageRequestRepository.save(req);

        broadcastState(roomId, List.of(userId));
    }

    public void decideStage(String actorUserId, DecideStagePayload p) {
        Room room = roomRepository.findById(p.getRoomId()).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (room.getType() != RoomType.VOICE) {
            throw new IllegalStateException("Voice only");
        }
        RoomMember actor = roomMemberRepository.findByRoomIdAndUserId(p.getRoomId(), actorUserId)
                .orElseThrow(() -> new IllegalStateException("Not a member"));
        if (actor.getRole() != RoomMemberRole.HOST && actor.getRole() != RoomMemberRole.ADMIN) {
            throw new IllegalStateException("Not allowed to accept requests");
        }

        StageRequest req = stageRequestRepository.findById(p.getRequestId())
                .orElseThrow(() -> new IllegalArgumentException("Request not found"));
        if (!req.getRoomId().equals(p.getRoomId()) || req.getStatus() != StageRequestStatus.PENDING) {
            throw new IllegalArgumentException("Invalid request");
        }

        if (!p.isApprove()) {
            req.setStatus(StageRequestStatus.REJECTED);
            stageRequestRepository.save(req);
            broadcastState(p.getRoomId(), List.of(req.getUserId()));
            return;
        }

        RoomMemberRole promote = p.getPromoteRole();
        if (promote != RoomMemberRole.SPEAKER && promote != RoomMemberRole.ADMIN) {
            throw new IllegalArgumentException("Invalid promote role");
        }
        if (promote == RoomMemberRole.ADMIN && actor.getRole() != RoomMemberRole.HOST) {
            throw new IllegalStateException("Only host can grant admin");
        }

        RoomMember target = roomMemberRepository.findByRoomIdAndUserId(p.getRoomId(), req.getUserId())
                .orElseThrow(() -> new IllegalStateException("Target not in room"));
        target.setRole(promote);
        target.setMicEnabled(promote == RoomMemberRole.SPEAKER || promote == RoomMemberRole.ADMIN);
        roomMemberRepository.save(target);

        req.setStatus(StageRequestStatus.ACCEPTED);
        stageRequestRepository.save(req);

        broadcastState(p.getRoomId(), List.of(req.getUserId()));
        messagingTemplate.convertAndSendToUser(req.getUserId(), "/queue/room",
                new RoomEventDto(EVENT_LIVEKIT_REFRESH, java.util.Map.of("roomId", p.getRoomId())));
    }

    public void removeFromStage(String actorUserId, RemoveFromStagePayload p) {
        Room room = roomRepository.findById(p.getRoomId()).orElseThrow(() -> new IllegalArgumentException("Room not found"));
        if (room.getType() != RoomType.VOICE) {
            throw new IllegalStateException("Voice only");
        }
        RoomMember actor = roomMemberRepository.findByRoomIdAndUserId(p.getRoomId(), actorUserId)
                .orElseThrow(() -> new IllegalStateException("Not a member"));
        if (actor.getRole() != RoomMemberRole.HOST && actor.getRole() != RoomMemberRole.ADMIN) {
            throw new IllegalStateException("Not allowed");
        }
        if (p.getTargetUserId().equals(room.getHostUserId())) {
            throw new IllegalStateException("Cannot remove host");
        }

        RoomMember target = roomMemberRepository.findByRoomIdAndUserId(p.getRoomId(), p.getTargetUserId())
                .orElseThrow(() -> new IllegalArgumentException("Target not in room"));
        if (target.getRole() != RoomMemberRole.SPEAKER && target.getRole() != RoomMemberRole.ADMIN) {
            throw new IllegalStateException("Target is not on stage");
        }

        target.setRole(RoomMemberRole.AUDIENCE);
        target.setMicEnabled(false);
        roomMemberRepository.save(target);

        broadcastState(p.getRoomId(), List.of(p.getTargetUserId()));
        messagingTemplate.convertAndSendToUser(p.getTargetUserId(), "/queue/room",
                new RoomEventDto(EVENT_LIVEKIT_REFRESH, java.util.Map.of("roomId", p.getRoomId())));
    }

    public void updateMicFlag(String roomId, String userId, boolean micOn) {
        RoomMember m = roomMemberRepository.findByRoomIdAndUserId(roomId, userId).orElseThrow();
        if (m.getRole() == RoomMemberRole.AUDIENCE || m.getRole() == RoomMemberRole.MEMBER) {
            throw new IllegalStateException("Audience cannot publish mic");
        }
        m.setMicEnabled(micOn);
        roomMemberRepository.save(m);
        broadcastState(roomId, List.of());
    }

    private RoomDto toDto(Room room, String currentUserId) {
        RoomDto dto = new RoomDto();
        dto.setId(room.getId());
        dto.setName(room.getName());
        dto.setDescription(room.getDescription());
        dto.setType(room.getType());
        dto.setHostUserId(room.getHostUserId());
        dto.setCreatedAt(room.getCreatedAt());
        dto.setMemberCount(roomMemberRepository.countByRoomId(room.getId()));
        roomMemberRepository.findByRoomIdAndUserId(room.getId(), currentUserId)
                .ifPresent(mem -> dto.setMyRole(mem.getRole()));
        return dto;
    }

    private RoomStatePayloadDto buildState(String roomId) {
        List<RoomMember> members = roomMemberRepository.findByRoomId(roomId);
        List<RoomMemberViewDto> stage = new ArrayList<>();
        List<RoomMemberViewDto> audience = new ArrayList<>();

        for (RoomMember m : members) {
            RoomMemberViewDto v = toView(m);
            if (isStageRole(m.getRole())) {
                stage.add(v);
            } else {
                audience.add(v);
            }
        }

        List<StageRequestViewDto> pending = stageRequestRepository
                .findByRoomIdAndStatus(roomId, StageRequestStatus.PENDING)
                .stream()
                .map(this::toRequestView)
                .collect(Collectors.toList());

        RoomStatePayloadDto payload = new RoomStatePayloadDto();
        payload.setStage(stage);
        payload.setAudience(audience);
        payload.setPendingRequests(pending);
        return payload;
    }

    private void broadcastState(String roomId, List<String> affectedUserIds) {
        RoomStatePayloadDto state = buildState(roomId);
        java.util.Map<String, Object> envelope = new java.util.LinkedHashMap<>();
        envelope.put("state", state);
        envelope.put("affectedUserIds", affectedUserIds);
        messagingTemplate.convertAndSend(topic(roomId), new RoomEventDto(EVENT_STATE, envelope));
    }

    private String topic(String roomId) {
        return "/topic/room." + roomId;
    }

    private boolean isStageRole(RoomMemberRole r) {
        return r == RoomMemberRole.HOST || r == RoomMemberRole.ADMIN || r == RoomMemberRole.SPEAKER;
    }

    private RoomMemberViewDto toView(RoomMember m) {
        String display = userRepository.findById(m.getUserId())
                .map(u -> u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername())
                .orElse(m.getUserId());
        return new RoomMemberViewDto(m.getUserId(), display, m.getRole(), m.isMicEnabled());
    }

    private StageRequestViewDto toRequestView(StageRequest r) {
        String display = userRepository.findById(r.getUserId())
                .map(u -> u.getFullName() != null && !u.getFullName().isBlank() ? u.getFullName() : u.getUsername())
                .orElse(r.getUserId());
        return new StageRequestViewDto(r.getId(), r.getUserId(), display);
=======
    private final LiveKitConfig liveKitConfig;
    private final ChatRoomRepository chatRoomRepository;

    public RoomService(LiveKitConfig liveKitConfig, ChatRoomRepository chatRoomRepository) {
        this.liveKitConfig = liveKitConfig;
        this.chatRoomRepository = chatRoomRepository;
    }

    public String createToken(String roomName, String identity, String name, boolean canPublish) {
        AccessToken token = new AccessToken(liveKitConfig.getApiKey(), liveKitConfig.getApiSecret());
        token.setName(name);
        token.setIdentity(identity);
        
        VideoGrant grant = new VideoGrant();
        grant.setRoomJoin(true);
        grant.setRoom(roomName);
        grant.setCanPublish(canPublish);
        grant.setCanSubscribe(true);
        
        token.addGrant(grant);
        return token.toJwt();
    }

    public List<ChatRoom> getAllRooms() {
        return chatRoomRepository.findAllByOrderByCreatedAtDesc();
    }

    public ChatRoom saveRoom(ChatRoom room) {
        return chatRoomRepository.save(room);
    }

    public Optional<ChatRoom> getRoomById(String id) {
        return chatRoomRepository.findById(id);
    }

    public void deleteRoom(String id) {
        chatRoomRepository.deleteById(id);
>>>>>>> Stashed changes
    }
}
