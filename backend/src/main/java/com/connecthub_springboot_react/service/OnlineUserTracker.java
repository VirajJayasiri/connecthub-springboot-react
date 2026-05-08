package com.connecthub_springboot_react.service;

import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.stereotype.Service;

@Service
public class OnlineUserTracker {

    private final Map<String, Integer> activeSessions = new ConcurrentHashMap<>();

    public void markOnline(String userId) {
        activeSessions.merge(userId, 1, Integer::sum);
    }

    public void markOffline(String userId) {
        activeSessions.computeIfPresent(userId, (key, value) -> value > 1 ? value - 1 : null);
    }

    public boolean isOnline(String userId) {
        return activeSessions.containsKey(userId);
    }
}
