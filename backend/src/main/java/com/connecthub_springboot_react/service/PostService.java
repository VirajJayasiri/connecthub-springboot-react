package com.connecthub_springboot_react.service;

import com.connecthub_springboot_react.dto.PostRequest;
import com.connecthub_springboot_react.model.Post;
import com.connecthub_springboot_react.repository.PostRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class PostService {

    private final PostRepository postRepository;

    public PostService(PostRepository postRepository) {
        this.postRepository = postRepository;
    }

    public Post createPost(PostRequest request) {
        Post post = new Post();

        post.setAuthorName(request.getAuthorName());
        post.setAuthorEmail(request.getAuthorEmail());
        post.setContent(request.getContent());
        post.setImageUrl(request.getImageUrl());
        post.setLikes(0);
        post.setCreatedAt(LocalDateTime.now());

        return postRepository.save(post);
    }

    public List<Post> getAllPosts() {
        return postRepository.findAllByOrderByCreatedAtDesc();
    }

    public Post getPostById(String id) {
        return postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Post not found"));
    }

    public Post likePost(String id) {
        Post post = getPostById(id);
        post.setLikes(post.getLikes() + 1);
        return postRepository.save(post);
    }

    public void deletePost(String id) {
        if (!postRepository.existsById(id)) {
            throw new RuntimeException("Post not found");
        }

        postRepository.deleteById(id);
    }
}