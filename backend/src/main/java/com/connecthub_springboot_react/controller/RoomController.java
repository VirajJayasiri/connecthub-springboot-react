package com.connecthub_springboot_react.controller;

import com.connecthub_springboot_react.dto.room.CreateRoomRequest;
import com.connecthub_springboot_react.dto.room.LiveKitTokenResponse;
import com.connecthub_springboot_react.dto.room.RoomDto;
import com.connecthub_springboot_react.dto.room.RoomStatePayloadDto;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.RoomService;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/rooms")
public class RoomController {

    private final RoomService roomService;
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
    public LiveKitTokenResponse liveKit(
            Authentication auth,
            @PathVariable String roomId,
            @RequestParam(name = "displayName", required = false) String displayName) {
        return roomService.liveKitToken(roomId, resolveUserId(auth), displayName);
    }

    @DeleteMapping("/{roomId}")
    public void deleteRoom(Authentication auth, @PathVariable String roomId) {
        roomService.deleteRoom(resolveUserId(auth), roomId);
    }
}
