package com.connecthub_springboot_react.service;

import java.io.IOException;
import java.util.Optional;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import com.connecthub_springboot_react.util.S3PublicUrlUtils;

import software.amazon.awssdk.core.sync.RequestBody;
import software.amazon.awssdk.services.s3.S3Client;
import software.amazon.awssdk.services.s3.model.ObjectCannedACL;
import software.amazon.awssdk.services.s3.model.PutObjectRequest;

@Service
@ConditionalOnProperty(name = "aws.s3.enabled", havingValue = "true")
public class S3Service {

    private final S3Client s3Client;

    @Value("${aws.s3.bucket-name}")
    private String bucketName;

    @Value("${aws.s3.region}")
    private String region;

    /** When true, sets object ACL to public-read (requires bucket ACLs not disabled). Default false: use a bucket policy for public GetObject instead. */
    @Value("${aws.s3.use-object-acl:false}")
    private boolean useObjectAcl;

    public S3Service(S3Client s3Client) {
        this.s3Client = s3Client;
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
