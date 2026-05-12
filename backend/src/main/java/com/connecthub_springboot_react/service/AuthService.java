package com.connecthub_springboot_react.service;

import java.util.LinkedHashMap;
import java.util.Map;

import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.connecthub_springboot_react.dto.AuthResponse;
import com.connecthub_springboot_react.dto.LoginRequest;
import com.connecthub_springboot_react.dto.RegisterRequest;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.ChatMessageRepository;
import com.connecthub_springboot_react.repository.FriendRelationRepository;
import com.connecthub_springboot_react.repository.UserRepository;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final FriendRelationRepository friendRelationRepository;
    private final ChatMessageRepository chatMessageRepository;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            FriendRelationRepository friendRelationRepository,
            ChatMessageRepository chatMessageRepository
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
        this.friendRelationRepository = friendRelationRepository;
        this.chatMessageRepository = chatMessageRepository;
    }

    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already exists");
        }
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new RuntimeException("Username already taken");
        }

        User user = new User();
        user.setFullName(request.getFullName());
        user.setUsername(request.getUsername());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        // Return success message only — do NOT auto-login after signup
        return new AuthResponse("Account created successfully");
    }

    public AuthResponse login(LoginRequest request) {
        User user = userRepository.findByEmail(request.getUsernameOrEmail())
                .orElseGet(() -> userRepository.findByUsername(request.getUsernameOrEmail())
                .orElseThrow(() -> new RuntimeException("Invalid email or password")));

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new RuntimeException("Invalid email or password");
        }

        String token = jwtService.generateToken(user.getEmail());

        Map<String, Object> userMap = new LinkedHashMap<>();
        userMap.put("_id", user.getId());
        userMap.put("fullName", user.getFullName());
        userMap.put("username", user.getUsername());
        userMap.put("email", user.getEmail());
        userMap.put("profileImage", user.getProfileImage());
        userMap.put("coverImage", user.getCoverImage());
        userMap.put("bio", user.getBio());
        userMap.put("location", user.getLocation());
        userMap.put("website", user.getWebsite());

        return new AuthResponse("Login successful", token, userMap);
    }

    public void deleteAccount(String email, String password) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (!passwordEncoder.matches(password, user.getPassword())) {
            throw new RuntimeException("Invalid password");
        }

        friendRelationRepository.deleteByUserIdOrFriendId(user.getId(), user.getId());
        chatMessageRepository.deleteBySenderIdOrReceiverId(user.getId(), user.getId());
        userRepository.delete(user);
    }
}
