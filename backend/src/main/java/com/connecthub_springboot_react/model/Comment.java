package com.connecthub_springboot_react.model;

import java.time.Instant;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "comments")
public class Comment {

    @Id
    private String id;

    private String postId;

    private String authorId;
    private String authorUsername;
    private String authorFullName;
    private String authorProfileImage;

    private String content;

    private Instant createdAt;

    public Comment() {
    }

    // ── Getters & Setters ──────────────────────────────────────

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPostId() { return postId; }
    public void setPostId(String postId) { this.postId = postId; }

    public String getAuthorId() { return authorId; }
    public void setAuthorId(String authorId) { this.authorId = authorId; }

    public String getAuthorUsername() { return authorUsername; }
    public void setAuthorUsername(String authorUsername) { this.authorUsername = authorUsername; }

    public String getAuthorFullName() { return authorFullName; }
    public void setAuthorFullName(String authorFullName) { this.authorFullName = authorFullName; }

    public String getAuthorProfileImage() { return authorProfileImage; }
    public void setAuthorProfileImage(String authorProfileImage) { this.authorProfileImage = authorProfileImage; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public Instant getCreatedAt() { return createdAt; }
    public void setCreatedAt(Instant createdAt) { this.createdAt = createdAt; }
}
