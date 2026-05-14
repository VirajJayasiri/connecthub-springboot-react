package com.connecthub_springboot_react.repository;

import com.connecthub_springboot_react.model.ChatRoom;
import org.springframework.data.mongodb.repository.MongoRepository;
import java.util.List;

public interface ChatRoomRepository extends MongoRepository<ChatRoom, String> {
    List<ChatRoom> findAllByOrderByCreatedAtDesc();
}
