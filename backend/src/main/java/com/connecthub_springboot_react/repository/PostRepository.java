package com.connecthub_springboot_react.repository;

import com.connecthub_springboot_react.model.Post;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends MongoRepository<Post, String> {

    List<Post> findAllByOrderByCreatedAtDesc();

    List<Post> findByAuthorEmailOrderByCreatedAtDesc(String authorEmail);
}