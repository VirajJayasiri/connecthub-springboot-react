package com.connecthub_springboot_react.controller;

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
    }
}
