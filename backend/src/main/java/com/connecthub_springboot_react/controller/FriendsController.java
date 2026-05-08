package com.connecthub_springboot_react.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connecthub_springboot_react.dto.FriendAddResponse;
import com.connecthub_springboot_react.dto.FriendSummaryDto;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.service.FriendService;
import com.connecthub_springboot_react.service.UserService;

@RestController
@RequestMapping("/api/friends")
public class FriendsController {

    private final FriendService friendService;
    private final UserService userService;

    public FriendsController(FriendService friendService, UserService userService) {
        this.friendService = friendService;
        this.userService = userService;
    }

    @GetMapping
    public ResponseEntity<List<FriendSummaryDto>> getFriends(Authentication authentication) {
        User currentUser = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(friendService.getFriends(currentUser.getId()));
    }

    @PostMapping("/add/{friendId}")
    public ResponseEntity<FriendAddResponse> addFriend(
            Authentication authentication,
            @PathVariable String friendId
    ) {
        User currentUser = userService.getByEmail(authentication.getName());
        boolean added = friendService.addFriend(currentUser.getId(), friendId);
        FriendSummaryDto friend = friendService.getFriendSummary(currentUser.getId(), friendId);

        return ResponseEntity.ok(new FriendAddResponse(added, friend));
    }
}
