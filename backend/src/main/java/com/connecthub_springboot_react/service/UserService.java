package com.connecthub_springboot_react.service;

import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Optional;
import java.util.UUID;

import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final Optional<S3Service> s3Service;

    public UserService(UserRepository userRepository, Optional<S3Service> s3Service) {
        this.userRepository = userRepository;
        this.s3Service = s3Service;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }

    /**
     * Stores profile image in S3 when enabled, otherwise under {@code uploads/profiles/}.
     * Deletes the previous image when it was stored by this app (S3 or local uploads path).
     */
    public User updateProfileImage(String email, MultipartFile file) throws IOException {
        if (file == null || file.isEmpty()) {
            throw new IllegalArgumentException("Image file is required");
        }
        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new IllegalArgumentException("Only image uploads are allowed for profile pictures");
        }

        User user = getByEmail(email);
        String previous = user.getProfileImage();
        deletePreviousProfileAsset(previous);

        String imageUrl;
        if (s3Service.isPresent()) {
            imageUrl = s3Service.get().uploadFile(file, "profiles");
        } else {
            imageUrl = saveProfileImageLocal(file);
        }

        user.setProfileImage(imageUrl);
        return userRepository.save(user);
    }

    private void deletePreviousProfileAsset(String previous) {
        if (previous == null || previous.isBlank()) {
            return;
        }
        if (previous.contains("ui-avatars.com")) {
            return;
        }
        if (s3Service.isPresent() && previous.contains(".amazonaws.com/")) {
            s3Service.get().deleteFile(previous);
            return;
        }
        if (previous.contains("/uploads/")) {
            deleteLocalUploadsFile(previous);
        }
    }

    private void deleteLocalUploadsFile(String mediaUrl) {
        int idx = mediaUrl.indexOf("/uploads/");
        if (idx < 0) {
            return;
        }
        String relative = mediaUrl.substring(idx + "/uploads/".length());
        if (relative.isEmpty() || relative.contains("..")) {
            return;
        }
        try {
            Path base = Paths.get("uploads").toAbsolutePath().normalize();
            Path target = base.resolve(relative).normalize();
            if (!target.startsWith(base)) {
                return;
            }
            Files.deleteIfExists(target);
        } catch (IOException ignored) {
            // best-effort
        }
    }

    private String saveProfileImageLocal(MultipartFile file) throws IOException {
        Path dir = Paths.get("uploads", "profiles");
        Files.createDirectories(dir);
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String fileName = UUID.randomUUID().toString() + extension;
        Path target = dir.resolve(fileName);
        try (InputStream in = file.getInputStream()) {
            Files.copy(in, target, StandardCopyOption.REPLACE_EXISTING);
        }
        return "/uploads/profiles/" + fileName;
    }
}
