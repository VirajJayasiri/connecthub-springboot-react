package com.connecthub_springboot_react.controller;

import com.connecthub_springboot_react.dto.AuthResponse;
import com.connecthub_springboot_react.dto.LoginRequest;
import com.connecthub_springboot_react.dto.RegisterRequest;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.AuthService;
import com.connecthub_springboot_react.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.LinkedHashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;
    private final UserService userService;

    public AuthController(AuthService authService, UserRepository userRepository, UserService userService) {
        this.authService = authService;
        this.userRepository = userRepository;
        this.userService = userService;
    }

    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * GET /api/auth/me — returns the currently authenticated user's profile.
     * Requires a valid JWT in the Authorization header.
     */
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(Authentication authentication) {
        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("_id", user.getId());
        profile.put("fullName", user.getFullName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("profileImage", user.getProfileImage());

        return ResponseEntity.ok(profile);
    }

    /**
     * POST /api/auth/me/profile-image — multipart field {@code file} (image/*). Stores in S3 when enabled, else uploads/profiles.
     */
    @PostMapping(value = "/me/profile-image", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<?> updateProfileImage(
            Authentication authentication,
            @RequestParam("file") MultipartFile file
    ) throws IOException {
        try {
            User user = userService.updateProfileImage(authentication.getName(), file);

            Map<String, Object> profile = new LinkedHashMap<>();
            profile.put("_id", user.getId());
            profile.put("fullName", user.getFullName());
            profile.put("username", user.getUsername());
            profile.put("email", user.getEmail());
            profile.put("profileImage", user.getProfileImage());

            return ResponseEntity.ok(profile);
        } catch (IllegalArgumentException ex) {
            return ResponseEntity.badRequest().body(Map.of("message", ex.getMessage()));
        }
    }
}
