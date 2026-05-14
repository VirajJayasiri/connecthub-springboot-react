package com.connecthub_springboot_react.config;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class LiveKitConfig {

    @Value("${livekit.api.key}")
    private String apiKey;

    @Value("${livekit.api.secret}")
    private String apiSecret;

    @Value("${livekit.url}")
    private String livekitUrl;

    public String getApiKey() { return apiKey; }
    public String getApiSecret() { return apiSecret; }
    public String getLivekitUrl() { return livekitUrl; }
}
