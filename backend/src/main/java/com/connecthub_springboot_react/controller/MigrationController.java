package com.connecthub_springboot_react.controller;

import java.util.LinkedHashMap;
import java.util.Map;
import java.util.concurrent.atomic.AtomicInteger;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connecthub_springboot_react.model.Post;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.PostRepository;
import com.connecthub_springboot_react.repository.UserRepository;

/**
 * One-off migration endpoint to fix stale media URLs stored in MongoDB.
 * Strips hardcoded "http://localhost:8080" prefixes, converting them to
 * relative paths like "/uploads/..." so they work inside Docker (via Nginx proxy).
 *
 * Call once: POST /api/admin/migrate-urls
 */
@RestController
@RequestMapping("/api/admin")
public class MigrationController {

    private static final String LOCALHOST_PREFIX = "http://localhost:8080";

    private final UserRepository userRepository;
    private final PostRepository postRepository;

    public MigrationController(UserRepository userRepository, PostRepository postRepository) {
        this.userRepository = userRepository;
        this.postRepository = postRepository;
    }

    @PostMapping("/migrate-urls")
    public ResponseEntity<Map<String, Object>> migrateUrls() {
        AtomicInteger usersFixed = new AtomicInteger(0);
        AtomicInteger postsFixed = new AtomicInteger(0);

        // Fix users: profileImage and coverImage
        userRepository.findAll().forEach(user -> {
            boolean changed = false;

            String pi = user.getProfileImage();
            if (pi != null && pi.startsWith(LOCALHOST_PREFIX)) {
                user.setProfileImage(pi.substring(LOCALHOST_PREFIX.length()));
                changed = true;
            }

            String ci = user.getCoverImage();
            if (ci != null && ci.startsWith(LOCALHOST_PREFIX)) {
                user.setCoverImage(ci.substring(LOCALHOST_PREFIX.length()));
                changed = true;
            }

            if (changed) {
                userRepository.save(user);
                usersFixed.incrementAndGet();
            }
        });

        // Fix posts: mediaUrl and authorProfileImage
        postRepository.findAll().forEach(post -> {
            boolean changed = false;

            String mu = post.getMediaUrl();
            if (mu != null && mu.startsWith(LOCALHOST_PREFIX)) {
                post.setMediaUrl(mu.substring(LOCALHOST_PREFIX.length()));
                changed = true;
            }

            String api = post.getAuthorProfileImage();
            if (api != null && api.startsWith(LOCALHOST_PREFIX)) {
                post.setAuthorProfileImage(api.substring(LOCALHOST_PREFIX.length()));
                changed = true;
            }

            if (changed) {
                postRepository.save(post);
                postsFixed.incrementAndGet();
            }
        });

        Map<String, Object> result = new LinkedHashMap<>();
        result.put("message", "URL migration complete");
        result.put("usersFixed", usersFixed.get());
        result.put("postsFixed", postsFixed.get());
        return ResponseEntity.ok(result);
    }
}
