package com.connecthub_springboot_react.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.connecthub_springboot_react.dto.UserSummaryDto;
import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.service.FriendService;
import com.connecthub_springboot_react.service.UserService;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final FriendService friendService;
    private final UserService userService;

    public UserController(FriendService friendService, UserService userService) {
        this.friendService = friendService;
        this.userService = userService;
    }

    @GetMapping("/suggested")
    public ResponseEntity<List<UserSummaryDto>> getSuggestedUsers(Authentication authentication) {
        User currentUser = userService.getByEmail(authentication.getName());
        return ResponseEntity.ok(friendService.getSuggestedFriends(currentUser.getId()));
    }
}
