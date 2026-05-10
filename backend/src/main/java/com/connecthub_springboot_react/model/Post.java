package com.connecthub_springboot_react.model;

import java.time.Instant;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "posts")
public class Post {

    @Id
    private String id;

    private String authorId;
    private String authorUsername;
    private String authorFullName;
    private String authorProfileImage;

    private String caption;

    /** "IMAGE", "VIDEO", or null for text-only posts */
    private String mediaType;

    /** URL of the uploaded media file */
    private String mediaUrl;

    /** Reaction type -> set of user IDs.  e.g. {"LIKE": ["u1","u2"], "LOVE": ["u3"]} */
    private Map<String, Set<String>> reactions = new HashMap<>();

    private int commentCount;

    private Instant createdAt;

    public Post() {
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

    public Map<String, Set<String>> getReactions() { return reactions; }
    public void setReactions(Map<String, Set<String>> reactions) { this.reactions = reactions; }

    public int getCommentCount() { return commentCount; }
    public void setCommentCount(int commentCount) { this.commentCount = commentCount; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
