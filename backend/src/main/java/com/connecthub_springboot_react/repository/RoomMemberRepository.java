package com.connecthub_springboot_react.repository;

import com.connecthub_springboot_react.model.room.RoomMember;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface RoomMemberRepository extends MongoRepository<RoomMember, String> {

    List<RoomMember> findByRoomId(String roomId);

    Optional<RoomMember> findByRoomIdAndUserId(String roomId, String userId);

    long countByRoomId(String roomId);
}
