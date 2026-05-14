package com.connecthub_springboot_react.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.HashSet;
import java.util.Set;

@Document(collection = "chat_rooms")
public class ChatRoom {
    @Id
    private String id;
    private String name;
    private String description;
    private String type; // "TEXT", "VOICE", "VIDEO"
    private String privacy; // "PUBLIC", "PRIVATE"
    private String hostId;
    private Set<String> adminIds = new HashSet<>();
    private Instant createdAt;

    public ChatRoom() {}

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public String getPrivacy() { return privacy; }
    public void setPrivacy(String privacy) { this.privacy = privacy; }
    public String getHostId() { return hostId; }
    public void setHostId(String hostId) { this.hostId = hostId; }
    public Set<String> getAdminIds() { return adminIds; }
    public void setAdminIds(Set<String> adminIds) { this.adminIds = adminIds; }
    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
