package com.connecthub_springboot_react.controller;

import com.connecthub_springboot_react.dto.room.LiveKitTokenRequest;
import com.connecthub_springboot_react.dto.room.LiveKitTokenResponse;
import com.connecthub_springboot_react.service.LiveKitService;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/livekit")
public class LiveKitController {

    private final LiveKitService liveKitService;

    public LiveKitController(LiveKitService liveKitService) {
        this.liveKitService = liveKitService;
    }

    @PostMapping("/token")
    public LiveKitTokenResponse token(@RequestBody LiveKitTokenRequest request) {
        return liveKitService.generateToken(request);
    }
}
