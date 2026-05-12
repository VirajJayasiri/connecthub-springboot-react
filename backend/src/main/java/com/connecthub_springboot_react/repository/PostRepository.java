package com.connecthub_springboot_react.repository;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;

import com.connecthub_springboot_react.model.Post;

public interface PostRepository extends MongoRepository<Post, String> {

    Page<Post> findAllByOrderByCreatedAtDesc(Pageable pageable);
}
