package com.connecthub_springboot_react.service;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;

import com.connecthub_springboot_react.dto.FriendSummaryDto;
import com.connecthub_springboot_react.dto.UserSummaryDto;
import com.connecthub_springboot_react.model.ChatMessage;
import com.connecthub_springboot_react.model.FriendRelation;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.FriendRelationRepository;
import com.connecthub_springboot_react.repository.UserRepository;

@Service
public class FriendService {

    private final FriendRelationRepository friendRelationRepository;
    private final UserRepository userRepository;
    private final MessageService messageService;
    private final OnlineUserTracker onlineUserTracker;

    public FriendService(
            FriendRelationRepository friendRelationRepository,
            UserRepository userRepository,
            MessageService messageService,
            OnlineUserTracker onlineUserTracker
    ) {
        this.friendRelationRepository = friendRelationRepository;
        this.userRepository = userRepository;
        this.messageService = messageService;
        this.onlineUserTracker = onlineUserTracker;
    }

    public List<UserSummaryDto> getSuggestedFriends(String userId) {
        return userRepository.findAll().stream()
                .filter(user -> !user.getId().equals(userId))
                .sorted(Comparator.comparing(User::getFullName, Comparator.nullsLast(String::compareToIgnoreCase)))
                .map(user -> new UserSummaryDto(
                        user.getId(),
                        user.getFullName(),
                        user.getUsername(),
                        user.getProfileImage(),
                        onlineUserTracker.isOnline(user.getId())
                ))
                .toList();
    }

    public boolean addFriend(String userId, String friendId) {
        if (userId.equals(friendId)) {
            throw new IllegalArgumentException("Cannot add yourself as a friend");
        }
        if (!userRepository.existsById(friendId)) {
            throw new IllegalArgumentException("User not found");
        }
        if (friendRelationRepository.existsByUserIdAndFriendId(userId, friendId)
                || friendRelationRepository.existsByUserIdAndFriendId(friendId, userId)) {
            return false;
        }

        FriendRelation relation = new FriendRelation(userId, friendId, Instant.now());
        friendRelationRepository.save(relation);
        return true;
    }

    public List<FriendSummaryDto> getFriends(String userId) {
        List<FriendRelation> relations = friendRelationRepository.findByUserIdOrFriendId(userId, userId);
        if (relations.isEmpty()) {
            return List.of();
        }

        Set<String> friendIds = relations.stream()
                .map(relation -> relation.getUserId().equals(userId)
                        ? relation.getFriendId()
                        : relation.getUserId())
                .collect(Collectors.toSet());

        Map<String, User> usersById = userRepository.findAllById(friendIds).stream()
                .collect(Collectors.toMap(User::getId, user -> user));

        return friendIds.stream()
                .map(friendId -> buildFriendSummary(userId, friendId, usersById.get(friendId)))
                .filter(friend -> friend != null)
                .toList();
    }

    public FriendSummaryDto getFriendSummary(String userId, String friendId) {
        User friend = userRepository.findById(friendId).orElse(null);
        return buildFriendSummary(userId, friendId, friend);
    }

    private FriendSummaryDto buildFriendSummary(String userId, String friendId, User friend) {
        if (friend == null) {
            return null;
        }

        ChatMessage lastMessage = messageService.getLatestMessage(userId, friendId);
        String lastMessageText = lastMessage != null ? lastMessage.getContent() : "Start a conversation";
        long unreadCount = messageService.getUnreadCount(friendId, userId);

        return new FriendSummaryDto(
                friend.getId(),
                friend.getFullName(),
                friend.getUsername(),
                friend.getProfileImage(),
                onlineUserTracker.isOnline(friend.getId()),
                lastMessageText,
                unreadCount
        );
    }
}
