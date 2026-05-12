package com.connecthub_springboot_react.config;

import java.security.Principal;

import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import com.connecthub_springboot_react.dto.UserStatusDto;
import com.connecthub_springboot_react.service.OnlineUserTracker;

@Component
public class WebSocketEventListener {

    private final OnlineUserTracker onlineUserTracker;
    private final SimpMessagingTemplate messagingTemplate;

    public WebSocketEventListener(OnlineUserTracker onlineUserTracker, SimpMessagingTemplate messagingTemplate) {
        this.onlineUserTracker = onlineUserTracker;
        this.messagingTemplate = messagingTemplate;
    }

    @EventListener
    public void handleSessionConnected(SessionConnectEvent event) {
        Principal user = StompHeaderAccessor.wrap(event.getMessage()).getUser();
        if (user == null) {
            return;
        }
        String userId = user.getName();
        onlineUserTracker.markOnline(userId);
        messagingTemplate.convertAndSend("/topic/status", new UserStatusDto(userId, true));
    }

    @EventListener
    public void handleSessionDisconnected(SessionDisconnectEvent event) {
        Principal user = StompHeaderAccessor.wrap(event.getMessage()).getUser();
        if (user == null) {
            return;
        }
        String userId = user.getName();
        onlineUserTracker.markOffline(userId);
        messagingTemplate.convertAndSend("/topic/status", new UserStatusDto(userId, false));
    }
}
