package com.connecthub_springboot_react.dto;

import java.time.Instant;
import java.util.Map;

public class PostDto {

    private String id;
    private String authorId;
    private String authorUsername;
    private String authorFullName;
    private String authorProfileImage;
    private String caption;
    private String mediaType;
    private String mediaUrl;
    private Map<String, Integer> reactionCounts;   // e.g. {"LIKE": 5, "LOVE": 2}
    private String currentUserReaction;             // e.g. "LIKE" or null
    private int commentCount;
    private Instant createdAt;

    public PostDto() {
    }

    // ── Getters & Setters ──────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public String getAuthorFullName() { return authorFullName; }
    public void setAuthorFullName(String authorFullName) { this.authorFullName = authorFullName; }

    public String getAuthorProfileImage() { return authorProfileImage; }
    public void setAuthorProfileImage(String authorProfileImage) { this.authorProfileImage = authorProfileImage; }

    public String getCaption() { return caption; }
    public void setCaption(String caption) { this.caption = caption; }

    public String getMediaType() { return mediaType; }
    public void setMediaType(String mediaType) { this.mediaType = mediaType; }

    public String getMediaUrl() { return mediaUrl; }
    public void setMediaUrl(String mediaUrl) { this.mediaUrl = mediaUrl; }

    public Map<String, Integer> getReactionCounts() { return reactionCounts; }
    public void setReactionCounts(Map<String, Integer> reactionCounts) { this.reactionCounts = reactionCounts; }

    public String getCurrentUserReaction() { return currentUserReaction; }
    public void setCurrentUserReaction(String currentUserReaction) { this.currentUserReaction = currentUserReaction; }

    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
