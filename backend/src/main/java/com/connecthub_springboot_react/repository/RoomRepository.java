package com.connecthub_springboot_react.repository;

import com.connecthub_springboot_react.model.room.Room;
import org.springframework.data.mongodb.repository.MongoRepository;

public interface RoomRepository extends MongoRepository<Room, String> {
}
