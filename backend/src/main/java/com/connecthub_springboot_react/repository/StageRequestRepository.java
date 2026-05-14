package com.connecthub_springboot_react.repository;

import com.connecthub_springboot_react.model.room.StageRequest;
import com.connecthub_springboot_react.model.room.StageRequestStatus;
import org.springframework.data.mongodb.repository.MongoRepository;

import java.util.List;
import java.util.Optional;

public interface StageRequestRepository extends MongoRepository<StageRequest, String> {

    List<StageRequest> findByRoomIdAndStatus(String roomId, StageRequestStatus status);

    Optional<StageRequest> findByRoomIdAndUserIdAndStatus(String roomId, String userId, StageRequestStatus status);

    void deleteByRoomId(String roomId);
}
