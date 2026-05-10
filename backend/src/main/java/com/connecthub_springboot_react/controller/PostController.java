package com.connecthub_springboot_react.controller;

import java.io.IOException;
import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.dto.CommentDto;
import com.connecthub_springboot_react.dto.CreateCommentRequest;
import com.connecthub_springboot_react.dto.PostDto;
import com.connecthub_springboot_react.dto.ReactionRequest;
import com.connecthub_springboot_react.model.Post;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.service.PostService;
import com.connecthub_springboot_react.service.UserService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;
    private final UserService userService;

    public PostController(PostService postService, UserService userService) {
        this.postService = postService;
        this.userService = userService;
    }

    /**
     * Create a new post.
     * Accepts multipart: "caption" (text) + optional "media" (image or video file).
     */
    @PostMapping
    public ResponseEntity<PostDto> createPost(
            Authentication authentication,
            @RequestParam(value = "caption", required = false, defaultValue = "") String caption,
            @RequestParam(value = "media", required = false) MultipartFile media
    ) throws IOException {
        User user = userService.getByEmail(authentication.getName());
        Post post = postService.createPost(user, caption, media);

        // Return the created post as a DTO
        PostDto created = postService.toDto(post, user.getId());

        return ResponseEntity.ok(created);
    }

    /**
     * Get all posts (feed), newest first.
     */
    @GetMapping
    public ResponseEntity<Page<PostDto>> getAllPosts(
            Authentication authentication,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size
    ) {
        User user = userService.getByEmail(authentication.getName());
        Pageable pageable = PageRequest.of(page, size);
        return ResponseEntity.ok(postService.getAllPosts(user.getId(), pageable));
    }

    /**
     * Delete a post (author only).
     */
    @DeleteMapping("/{postId}")
    public ResponseEntity<Void> deletePost(
            Authentication authentication,
            @PathVariable String postId
    ) {
        User user = userService.getByEmail(authentication.getName());
        postService.deletePost(postId, user.getId());
        return ResponseEntity.noContent().build();
    }

    /**
     * Toggle a reaction on a post.
     */
    @PostMapping("/{postId}/reactions")
    public ResponseEntity<PostDto> toggleReaction(
            Authentication authentication,
            @PathVariable String postId,
            @Valid @RequestBody ReactionRequest request
    ) {
        User user = userService.getByEmail(authentication.getName());
        PostDto updated = postService.toggleReaction(postId, user.getId(), request.getType());
        return ResponseEntity.ok(updated);
    }

    /**
     * Get comments for a post.
     */
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<CommentDto>> getComments(@PathVariable String postId) {
        return ResponseEntity.ok(postService.getComments(postId));
    }

    /**
     * Add a comment to a post.
     */
    @PostMapping("/{postId}/comments")
    public ResponseEntity<CommentDto> addComment(
            Authentication authentication,
            @PathVariable String postId,
            @Valid @RequestBody CreateCommentRequest request
    ) {
        User user = userService.getByEmail(authentication.getName());
        CommentDto comment = postService.addComment(postId, user, request.getContent());
        return ResponseEntity.ok(comment);
    }

    /**
     * Delete a comment (comment author only).
     */
    @DeleteMapping("/comments/{commentId}")
    public ResponseEntity<Void> deleteComment(
            Authentication authentication,
            @PathVariable String commentId
    ) {
        User user = userService.getByEmail(authentication.getName());
        postService.deleteComment(commentId, user.getId());
        return ResponseEntity.noContent().build();
    }
}
