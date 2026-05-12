package com.connecthub_springboot_react.controller;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connecthub_springboot_react.dto.AuthResponse;
import com.connecthub_springboot_react.dto.DeleteAccountRequest;
import com.connecthub_springboot_react.dto.LoginRequest;
import com.connecthub_springboot_react.dto.RegisterRequest;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;
import com.connecthub_springboot_react.service.AuthService;

import jakarta.validation.Valid;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final UserRepository userRepository;

    public AuthController(AuthService authService, UserRepository userRepository) {
        this.authService = authService;
        this.userRepository = userRepository;
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
}
