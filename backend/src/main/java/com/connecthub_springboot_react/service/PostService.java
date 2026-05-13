package com.connecthub_springboot_react.service;

import java.io.IOException;
import java.time.Instant;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.dto.CommentDto;
import com.connecthub_springboot_react.dto.PostDto;
import com.connecthub_springboot_react.model.Comment;
import com.connecthub_springboot_react.model.Post;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.CommentRepository;
import com.connecthub_springboot_react.repository.PostRepository;

@Service
public class PostService {

    private final PostRepository postRepository;
    private final CommentRepository commentRepository;
    private final S3Service s3Service;

    public PostService(PostRepository postRepository, CommentRepository commentRepository, S3Service s3Service) {
        this.postRepository = postRepository;
        this.commentRepository = commentRepository;
        this.s3Service = s3Service;
    }

    // ── Create Post ────────────────────────────────────────────

    public Post createPost(User author, String caption, MultipartFile media) throws IOException {
        Post post = new Post();
        post.setAuthorId(author.getId());
        post.setAuthorUsername(author.getUsername());
        post.setAuthorFullName(author.getFullName());
        post.setAuthorProfileImage(author.getProfileImage());
        post.setCaption(caption);
        post.setCreatedAt(Instant.now());
        post.setCommentCount(0);
        post.setReactions(new HashMap<>());

        if (media != null && !media.isEmpty()) {
            String contentType = media.getContentType();
            if (contentType != null) {
                if (contentType.startsWith("video")) {
                    post.setMediaType("VIDEO");
                } else if (contentType.startsWith("audio")) {
                    post.setMediaType("AUDIO");
                } else {
                    post.setMediaType("IMAGE");
                }
            } else {
                post.setMediaType("IMAGE");
            }
            
            try {
                String mediaUrl = s3Service.uploadFile(media);
                post.setMediaUrl(mediaUrl);
            } catch (IOException e) {
                throw new RuntimeException("Failed to upload file to S3", e);
            }
        }

        return postRepository.save(post);
    }

    // ── Get All Posts ──────────────────────────────────────────

    public Page<PostDto> getAllPosts(String currentUserId, Pageable pageable) {
        Page<Post> posts = postRepository.findAllByOrderByCreatedAtDesc(pageable);
        return posts.map(post -> toDto(post, currentUserId));
    }

    // ── Toggle Reaction ────────────────────────────────────────

    public PostDto toggleReaction(String postId, String userId, String reactionType) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Map<String, Set<String>> reactions = post.getReactions();
        if (reactions == null) {
            reactions = new HashMap<>();
        }

        // Remove user from any existing reaction first
        String existingReaction = null;
        for (Map.Entry<String, Set<String>> entry : reactions.entrySet()) {
            if (entry.getValue().contains(userId)) {
                existingReaction = entry.getKey();
                break;
            }
        }

        if (existingReaction != null) {
            reactions.get(existingReaction).remove(userId);
            if (reactions.get(existingReaction).isEmpty()) {
                reactions.remove(existingReaction);
            }
        }

        // If user clicked a different reaction, add it
        if (!reactionType.equals(existingReaction)) {
            reactions.computeIfAbsent(reactionType, k -> new HashSet<>()).add(userId);
        }

        post.setReactions(reactions);
        postRepository.save(post);

        return toDto(post, userId);
    }

    // ── Delete Post ────────────────────────────────────────────

    public void deletePost(String postId, String userId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        if (!post.getAuthorId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this post");
        }

        if (post.getMediaUrl() != null) {
            s3Service.deleteFile(post.getMediaUrl());
        }

        commentRepository.deleteAllByPostId(postId);
        postRepository.delete(post);
    }

    // ── Comments ───────────────────────────────────────────────

    public CommentDto addComment(String postId, User author, String content) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new RuntimeException("Post not found"));

        Comment comment = new Comment();
        comment.setPostId(postId);
        comment.setAuthorId(author.getId());
        comment.setAuthorUsername(author.getUsername());
        comment.setAuthorFullName(author.getFullName());
        comment.setAuthorProfileImage(author.getProfileImage());
        comment.setContent(content);
        comment.setCreatedAt(Instant.now());
        commentRepository.save(comment);

        // Update denormalized count
        post.setCommentCount(post.getCommentCount() + 1);
        postRepository.save(post);

        return toCommentDto(comment);
    }

    public List<CommentDto> getComments(String postId) {
        return commentRepository.findByPostIdOrderByCreatedAtAsc(postId).stream()
                .map(this::toCommentDto)
                .collect(Collectors.toList());
    }

    public void deleteComment(String commentId, String userId) {
        Comment comment = commentRepository.findById(commentId)
                .orElseThrow(() -> new RuntimeException("Comment not found"));

        if (!comment.getAuthorId().equals(userId)) {
            throw new RuntimeException("Not authorized to delete this comment");
        }

        // Decrement denormalized count
        postRepository.findById(comment.getPostId()).ifPresent(post -> {
            post.setCommentCount(Math.max(0, post.getCommentCount() - 1));
            postRepository.save(post);
        });

        commentRepository.delete(comment);
    }

    // ── DTO Mappers ────────────────────────────────────────────

    public PostDto toDto(Post post, String currentUserId) {
        PostDto dto = new PostDto();
        dto.setId(post.getId());
        dto.setAuthorId(post.getAuthorId());
        dto.setAuthorUsername(post.getAuthorUsername());
        dto.setAuthorFullName(post.getAuthorFullName());
        dto.setAuthorProfileImage(post.getAuthorProfileImage());
        dto.setCaption(post.getCaption());
        dto.setMediaType(post.getMediaType());
        dto.setMediaUrl(post.getMediaUrl());
        dto.setCommentCount(post.getCommentCount());
        dto.setCreatedAt(post.getCreatedAt());

        // Build reaction counts
        Map<String, Integer> reactionCounts = new HashMap<>();
        String currentUserReaction = null;
        if (post.getReactions() != null) {
            for (Map.Entry<String, Set<String>> entry : post.getReactions().entrySet()) {
                reactionCounts.put(entry.getKey(), entry.getValue().size());
                if (entry.getValue().contains(currentUserId)) {
                    currentUserReaction = entry.getKey();
                }
            }
        }
        dto.setReactionCounts(reactionCounts);
        dto.setCurrentUserReaction(currentUserReaction);

        return dto;
    }

    private CommentDto toCommentDto(Comment comment) {
        CommentDto dto = new CommentDto();
        dto.setId(comment.getId());
        dto.setPostId(comment.getPostId());
        dto.setAuthorId(comment.getAuthorId());
        dto.setAuthorUsername(comment.getAuthorUsername());
        dto.setAuthorFullName(comment.getAuthorFullName());
        dto.setAuthorProfileImage(comment.getAuthorProfileImage());
        dto.setContent(comment.getContent());
        dto.setCreatedAt(comment.getCreatedAt());
        return dto;
    }
}
