package com.connecthub_springboot_react.controller;

<<<<<<< Updated upstream
import com.connecthub_springboot_react.dto.room.*;
import com.connecthub_springboot_react.service.RoomService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.stereotype.Controller;

import java.security.Principal;

@Controller
public class RoomWebSocketController {

    private final RoomService roomService;

    public RoomWebSocketController(RoomService roomService) {
        this.roomService = roomService;
    }

    @MessageMapping("/room.chat.send")
    public void chat(@Payload RoomChatSendPayload payload, Principal principal) {
        if (principal == null || payload == null || payload.getRoomId() == null) {
            return;
        }
        roomService.sendRoomChat(payload.getRoomId(), principal.getName(), payload.getContent());
    }

    @MessageMapping("/room.voice.raiseHand")
    public void raiseHand(@Payload RaiseHandPayload payload, Principal principal) {
        if (principal == null || payload == null || payload.getRoomId() == null) {
            return;
        }
        roomService.raiseHand(payload.getRoomId(), principal.getName());
    }

    @MessageMapping("/room.voice.decideStage")
    public void decide(@Payload DecideStagePayload payload, Principal principal) {
        if (principal == null || payload == null || payload.getRoomId() == null) {
            return;
        }
        roomService.decideStage(principal.getName(), payload);
    }

    @MessageMapping("/room.voice.removeFromStage")
    public void remove(@Payload RemoveFromStagePayload payload, Principal principal) {
        if (principal == null || payload == null || payload.getRoomId() == null) {
            return;
        }
        roomService.removeFromStage(principal.getName(), payload);
=======
import com.connecthub_springboot_react.dto.StageRequest;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
public class RoomWebSocketController {

    private final SimpMessagingTemplate messagingTemplate;

    public RoomWebSocketController(SimpMessagingTemplate messagingTemplate) {
        this.messagingTemplate = messagingTemplate;
    }

    /**
     * User requests to join the stage.
     * Broadcast to /topic/room.{roomId}.requests
     */
    @MessageMapping("/room.requestStage")
    public void requestStage(@Payload StageRequest request) {
        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId() + ".requests", request);
    }

    /**
     * Host/Admin approves a request.
     * Broadcast to /topic/room.{roomId}.status
     */
    @MessageMapping("/room.approveStage")
    public void approveStage(@Payload StageRequest request) {
        // In a real app, you'd update the DB here as well
        messagingTemplate.convertAndSend("/topic/room." + request.getRoomId() + ".status", request);
>>>>>>> Stashed changes
    }
}
