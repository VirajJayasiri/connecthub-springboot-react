package com.connecthub_springboot_react.controller;

<<<<<<< Updated upstream
import com.connecthub_springboot_react.dto.room.CreateRoomRequest;
import com.connecthub_springboot_react.dto.room.LiveKitTokenResponse;
import com.connecthub_springboot_react.dto.room.RoomDto;
import com.connecthub_springboot_react.dto.room.RoomStatePayloadDto;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.RoomService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

=======
import com.connecthub_springboot_react.config.LiveKitConfig;
import com.connecthub_springboot_react.dto.RoomTokenResponse;
import com.connecthub_springboot_react.model.ChatRoom;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.service.RoomService;
import com.connecthub_springboot_react.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.Instant;
>>>>>>> Stashed changes
import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
<<<<<<< Updated upstream
    private final UserRepository userRepository;

    public RoomController(RoomService roomService, UserRepository userRepository) {
        this.roomService = roomService;
        this.userRepository = userRepository;
    }

    private String resolveUserId(Authentication auth) {
        String key = auth.getName();
        return userRepository.findByEmail(key)
                .map(User::getId)
                .or(() -> userRepository.findById(key).map(User::getId))
                .orElseThrow(() -> new IllegalStateException("User not found"));
    }

    @GetMapping
    public List<RoomDto> list(Authentication auth) {
        return roomService.listRooms(resolveUserId(auth));
    }

    @PostMapping
    public RoomDto create(Authentication auth, @RequestBody CreateRoomRequest body) {
        return roomService.createRoom(resolveUserId(auth), body);
    }

    @PostMapping("/{roomId}/join")
    public RoomDto join(Authentication auth, @PathVariable String roomId) {
        return roomService.joinRoom(roomId, resolveUserId(auth));
    }

    @GetMapping("/{roomId}/state")
    public RoomStatePayloadDto state(Authentication auth, @PathVariable String roomId) {
        String uid = resolveUserId(auth);
        roomService.joinRoom(roomId, uid);
        return roomService.getState(roomId);
    }

    @GetMapping("/{roomId}/livekit-token")
    public LiveKitTokenResponse liveKit(Authentication auth, @PathVariable String roomId) {
        return roomService.liveKitToken(roomId, resolveUserId(auth));
=======
    private final UserService userService;
    private final LiveKitConfig liveKitConfig;

    public RoomController(RoomService roomService, UserService userService, LiveKitConfig liveKitConfig) {
        this.roomService = roomService;
        this.userService = userService;
        this.liveKitConfig = liveKitConfig;
    }

    @GetMapping("/{roomId}/token")
    public ResponseEntity<RoomTokenResponse> getRoomToken(
            Authentication authentication,
            @PathVariable String roomId,
            @RequestParam(defaultValue = "false") boolean canPublish
    ) {
        User user = userService.getByEmail(authentication.getName());
        String token = roomService.createToken(roomId, user.getId(), user.getUsername(), canPublish);
        
        return ResponseEntity.ok(new RoomTokenResponse(token, liveKitConfig.getLivekitUrl()));
    }

    @GetMapping
    public ResponseEntity<List<ChatRoom>> getAllRooms() {
        return ResponseEntity.ok(roomService.getAllRooms());
    }

    @PostMapping
    public ResponseEntity<ChatRoom> createRoom(
            Authentication authentication,
            @RequestBody ChatRoom room
    ) {
        User user = userService.getByEmail(authentication.getName());
        room.setHostId(user.getId());
        room.setCreatedAt(Instant.now());
        return ResponseEntity.ok(roomService.saveRoom(room));
    }

    @DeleteMapping("/{roomId}")
    public ResponseEntity<Void> deleteRoom(
            Authentication authentication,
            @PathVariable String roomId
    ) {
        User user = userService.getByEmail(authentication.getName());
        ChatRoom room = roomService.getRoomById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));

        if (!room.getHostId().equals(user.getId())) {
            throw new RuntimeException("Only the host can terminate the room");
        }

        roomService.deleteRoom(roomId);
        return ResponseEntity.noContent().build();
>>>>>>> Stashed changes
    }
}
