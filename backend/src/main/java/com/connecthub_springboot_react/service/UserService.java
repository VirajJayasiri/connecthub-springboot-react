package com.connecthub_springboot_react.service;

import org.springframework.stereotype.Service;

import com.connecthub_springboot_react.model.User;
import com.connecthub_springboot_react.repository.UserRepository;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public User getByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
    }
}
