package com.connecthub_springboot_react.repository;

import java.util.List;

import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

import com.connecthub_springboot_react.model.FriendRelation;

@Repository
public interface FriendRelationRepository extends MongoRepository<FriendRelation, String> {
    boolean existsByUserIdAndFriendId(String userId, String friendId);
    List<FriendRelation> findByUserIdOrFriendId(String userId, String friendId);
    long deleteByUserIdOrFriendId(String userId, String friendId);
}
