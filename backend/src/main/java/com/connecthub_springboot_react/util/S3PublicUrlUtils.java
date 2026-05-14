package com.connecthub_springboot_react.util;

import java.net.URI;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.Arrays;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * Builds virtual-hosted–style S3 object URLs and extracts object keys for delete operations.
 */
public final class S3PublicUrlUtils {

    private S3PublicUrlUtils() {
    }

    public static String buildPublicUrl(String bucketName, String region, String key) {
        if (bucketName == null || region == null || key == null || key.isBlank()) {
            throw new IllegalArgumentException("bucket, region, and key are required");
        }
        String encodedKey = urlEncodeKeyPath(key);
        return String.format("https://%s.s3.%s.amazonaws.com/%s", bucketName, region, encodedKey);
    }

    /**
     * Extracts the S3 object key from a public HTTPS URL for this bucket (virtual-hosted style).
     */
    public static Optional<String> extractObjectKey(String fileUrl, String bucketName) {
        if (fileUrl == null || bucketName == null || fileUrl.isBlank() || bucketName.isBlank()) {
            return Optional.empty();
        }
        try {
            URI uri = URI.create(fileUrl.trim());
            if (!"https".equalsIgnoreCase(uri.getScheme())) {
                return Optional.empty();
            }
            String host = uri.getHost();
            if (host == null) {
                return Optional.empty();
            }
            String prefix = bucketName + ".s3.";
            if (!host.startsWith(prefix) || !host.endsWith(".amazonaws.com")) {
                return Optional.empty();
            }
            String path = uri.getPath();
            if (path == null || path.length() <= 1) {
                return Optional.empty();
            }
            String rawKey = path.startsWith("/") ? path.substring(1) : path;
            String decoded = URLDecoder.decode(rawKey, StandardCharsets.UTF_8);
            return Optional.of(decoded);
        } catch (Exception ignored) {
            return Optional.empty();
        }
    }

    static String urlEncodeKeyPath(String key) {
        return Arrays.stream(key.split("/"))
                .map(s -> URLEncoder.encode(s, StandardCharsets.UTF_8).replace("+", "%20"))
                .collect(Collectors.joining("/"));
    }
}
