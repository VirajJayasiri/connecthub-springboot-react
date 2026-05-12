package com.connecthub_springboot_react.service;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    public User updateProfile(
            String email,
            String fullName,
            String newEmail,
            String bio,
            String location,
            String website,
            MultipartFile profileImage,
            MultipartFile coverImage
    ) {
        User user = getByEmail(email);

        String normalizedName = normalizeText(fullName);
        if (normalizedName != null) {
            user.setFullName(normalizedName);
        }

        String normalizedEmail = normalizeText(newEmail);
        if (normalizedEmail != null && !normalizedEmail.equalsIgnoreCase(user.getEmail())) {
            if (userRepository.existsByEmail(normalizedEmail)) {
                throw new RuntimeException("Email already exists");
            }
            user.setEmail(normalizedEmail);
        }

        if (bio != null) {
            user.setBio(normalizeText(bio));
        }

        if (location != null) {
            user.setLocation(normalizeText(location));
        }

        if (website != null) {
            user.setWebsite(normalizeText(website));
        }

        if (profileImage != null && !profileImage.isEmpty()) {
            user.setProfileImage(storeFile(profileImage));
        }

        if (coverImage != null && !coverImage.isEmpty()) {
            user.setCoverImage(storeFile(coverImage));
        }

        return userRepository.save(user);
    }

    private String normalizeText(String value) {
        if (value == null) {
            return null;
        }
        String trimmed = value.trim();
        return trimmed.isEmpty() ? null : trimmed;
    }

    private String storeFile(MultipartFile file) {
        try {
            Path uploadDir = Paths.get("uploads");
            if (!Files.exists(uploadDir)) {
                Files.createDirectories(uploadDir);
            }

            String originalFilename = file.getOriginalFilename();
            String extension = "";
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String filename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadDir.resolve(filename);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            return "http://localhost:8080/uploads/" + filename;
        } catch (IOException ex) {
            throw new RuntimeException("Failed to store file", ex);
        }
    }
}
