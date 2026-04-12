package com.safardrop.safardrop.service;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    // Constructor injection
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ------------------- CREATE USER -------------------
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // ------------------- FIND BY EMAIL -------------------
    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    // ------------------- AUTHENTICATE USER -------------------
    public User authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);

        if (user != null && user.getPassword().equals(password)) {
            return user;
        }

        return null;
    }
}