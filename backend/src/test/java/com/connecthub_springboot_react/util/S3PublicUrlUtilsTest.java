package com.connecthub_springboot_react.util;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertTrue;

import java.util.Optional;

import org.junit.jupiter.api.Test;

class S3PublicUrlUtilsTest {

    @Test
    void buildPublicUrl_encodesSegments() {
        String url = S3PublicUrlUtils.buildPublicUrl("my-bucket", "eu-west-1", "posts/ab c.jpg");
        assertEquals("https://my-bucket.s3.eu-west-1.amazonaws.com/posts/ab%20c.jpg", url);
    }

    @Test
    void extractObjectKey_roundTrip() {
        String key = "profiles/uuid-1.png";
        String url = S3PublicUrlUtils.buildPublicUrl("app-bucket", "us-east-2", key);
        Optional<String> parsed = S3PublicUrlUtils.extractObjectKey(url, "app-bucket");
        assertTrue(parsed.isPresent());
        assertEquals(key, parsed.get());
    }

    @Test
    void extractObjectKey_rejectsOtherBucket() {
        String url = "https://other.s3.eu-west-1.amazonaws.com/x/y";
        assertTrue(S3PublicUrlUtils.extractObjectKey(url, "mine").isEmpty());
    }
}
