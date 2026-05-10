package com.connecthub_springboot_react.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;

import com.connecthub_springboot_react.model.Comment;

public interface CommentRepository extends MongoRepository<Comment, String> {

    List<Comment> findByPostIdOrderByCreatedAtAsc(String postId);

    long countByPostId(String postId);

    void deleteAllByPostId(String postId);
}
