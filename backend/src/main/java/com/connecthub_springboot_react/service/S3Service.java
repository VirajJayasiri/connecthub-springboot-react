package com.connecthub_springboot_react.service;

import java.io.IOException;
import java.time.Duration;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.util.S3PublicUrlUtils;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.GetObjectRequest;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;
import software.amazon.awssdk.services.s3.presigner.S3Presigner;
import software.amazon.awssdk.services.s3.presigner.model.GetObjectPresignRequest;

@Service
@ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "true")
public class S3Service {

    private final S3Client s3Client;
    private final S3Presigner s3Presigner;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    /** When true, sets object ACL to public-read (requires bucket ACLs not disabled). Default false: use a bucket policy for public GetObject instead. */
    @Value("${aws.s3.use-object-acl:false}")
    private boolean useObjectAcl;

    /** How long presigned GET URLs live when returning S3 keys to the browser (private buckets). */
    @Value("${aws.s3.presign-get-ttl-minutes:60}")
    private long presignGetTtlMinutes;

    public S3Service(S3Client s3Client, S3Presigner s3Presigner) {
        this.s3Client = s3Client;
        this.s3Presigner = s3Presigner;
    }

    /**
     * Browsers cannot send AWS SigV4 on {@code <img src>}. For private objects, return a presigned HTTPS URL.
     * Leaves localhost, relative paths, and third-party URLs unchanged.
     */
    public String resolveUrlForBrowserRead(String storedUrl) {
        if (storedUrl == null || storedUrl.isBlank()) {
            return storedUrl;
        }
        Optional<String> keyOpt = S3PublicUrlUtils.extractObjectKey(storedUrl, bucketName);
        if (keyOpt.isEmpty()) {
            return storedUrl;
        }
        try {
            GetObjectRequest get = GetObjectRequest.builder()
                    .bucket(bucketName)
                    .key(keyOpt.get())
                    .build();
            GetObjectPresignRequest presign = GetObjectPresignRequest.builder()
                    .signatureDuration(Duration.ofMinutes(Math.max(5, presignGetTtlMinutes)))
                    .getObjectRequest(get)
                    .build();
            return s3Presigner.presignGetObject(presign).url().toExternalForm();
        } catch (Exception e) {
            return storedUrl;
        }
    }

    public String uploadFile(MultipartFile file) throws IOException {
        return uploadFile(file, "uploads");
    }

    /**
     * Uploads to {@code folder/uuid.ext}. Use folders like {@code posts} or {@code profiles}.
     */
    public String uploadFile(MultipartFile file, String folder) throws IOException {
        String safeFolder = sanitizeFolder(folder);
        String originalFilename = file.getOriginalFilename();
        String extension = "";
        if (originalFilename != null && originalFilename.contains(".")) {
            extension = originalFilename.substring(originalFilename.lastIndexOf("."));
        }
        String key = safeFolder + "/" + UUID.randomUUID() + extension;

        String contentType = file.getContentType();
        if (contentType == null || contentType.isBlank()) {
            contentType = "application/octet-stream";
        }

        PutObjectRequest.Builder put = PutObjectRequest.builder()
                .bucket(bucketName)
                .key(key)
                .contentType(contentType);
        if (useObjectAcl) {
            put.acl(ObjectCannedACL.PUBLIC_READ);
        }

        s3Client.putObject(put.build(), RequestBody.fromInputStream(file.getInputStream(), file.getSize()));

        return S3PublicUrlUtils.buildPublicUrl(bucketName, region, key);
    }

    public void deleteFile(String fileUrl) {
        Optional<String> keyOpt = S3PublicUrlUtils.extractObjectKey(fileUrl, bucketName);
        if (keyOpt.isEmpty()) {
            return;
        }
        String key = keyOpt.get();
        s3Client.deleteObject(b -> b.bucket(bucketName).key(key));
    }

    private static String sanitizeFolder(String folder) {
        if (folder == null || folder.isBlank()) {
            return "uploads";
        }
        String f = folder.replaceAll("[^a-zA-Z0-9_-]", "").toLowerCase();
        return f.isBlank() ? "uploads" : f;
    }
}
