package com.connecthub_springboot_react.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.dto.AuthResponse;
import com.connecthub_springboot_react.dto.DeleteAccountRequest;
import com.connecthub_springboot_react.dto.LoginRequest;
import com.connecthub_springboot_react.dto.RegisterRequest;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.AuthService;
import com.connecthub_springboot_react.service.UserService;

import jakarta.validation.Valid;

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

        return ResponseEntity.ok(buildProfile(user));
        }

        /**
         * PUT /api/auth/me — update profile details and optional images.
         * Accepts multipart fields: fullName, email, bio, location, website, profileImage, coverImage.
         */
        @PutMapping("/me")
        public ResponseEntity<Map<String, Object>> updateCurrentUser(
            Authentication authentication,
            @RequestParam(value = "fullName", required = false) String fullName,
            @RequestParam(value = "email", required = false) String email,
            @RequestParam(value = "bio", required = false) String bio,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam(value = "website", required = false) String website,
            @RequestParam(value = "profileImage", required = false) MultipartFile profileImage,
            @RequestParam(value = "coverImage", required = false) MultipartFile coverImage
        ) {
        User updated = userService.updateProfile(
            authentication.getName(),
            fullName,
            email,
            bio,
            location,
            website,
            profileImage,
            coverImage
        );

        return ResponseEntity.ok(buildProfile(updated));
    }

    @DeleteMapping("/me")
    public ResponseEntity<Void> deleteAccount(
            Authentication authentication,
            @RequestBody DeleteAccountRequest request
    ) {
        String password = request == null || request.getPassword() == null
                ? ""
                : request.getPassword().trim();
        if (password.isEmpty()) {
            throw new RuntimeException("Password is required");
        }

        authService.deleteAccount(authentication.getName(), password);
        return ResponseEntity.noContent().build();
    }

    private Map<String, Object> buildProfile(User user) {
        Map<String, Object> profile = new LinkedHashMap<>();
        profile.put("_id", user.getId());
        profile.put("fullName", user.getFullName());
        profile.put("username", user.getUsername());
        profile.put("email", user.getEmail());
        profile.put("profileImage", user.getProfileImage());
        profile.put("coverImage", user.getCoverImage());
        profile.put("bio", user.getBio());
        profile.put("location", user.getLocation());
        profile.put("website", user.getWebsite());
        return profile;
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
