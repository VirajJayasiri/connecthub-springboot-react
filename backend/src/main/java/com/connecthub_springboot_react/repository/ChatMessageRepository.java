package com.connecthub_springboot_react.repository;

import java.util.List;

import org.springframework.data.domain.Pageable;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.data.mongodb.repository.Query;
import org.springframework.stereotype.Repository;

import com.connecthub_springboot_react.model.ChatMessage;

@Repository
public interface ChatMessageRepository extends MongoRepository<ChatMessage, String> {

    @Query("{ $or: [ { senderId: ?0, receiverId: ?1 }, { senderId: ?1, receiverId: ?0 } ] }")
    List<ChatMessage> findConversation(String userId, String friendId);

    @Query(value = "{ $or: [ { senderId: ?0, receiverId: ?1 }, { senderId: ?1, receiverId: ?0 } ] }", sort = "{ timestamp: -1 }")
    List<ChatMessage> findLatestBetween(String userId, String friendId, Pageable pageable);

    long countBySenderIdAndReceiverIdAndReadFalse(String senderId, String receiverId);

    List<ChatMessage> findBySenderIdAndReceiverIdAndReadFalse(String senderId, String receiverId);
}
