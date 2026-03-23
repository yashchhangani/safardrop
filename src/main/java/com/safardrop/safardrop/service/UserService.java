package com.safardrop.safardrop.service;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.repository.UserRepository;
import com.safardrop.safardrop.dto.UserDTO;
import com.safardrop.safardrop.exception.ResourceNotFoundException;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class UserService {

    private final UserRepository userRepository;

    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    // ✅ GET all users (DTO)
    public List<UserDTO> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(user -> new UserDTO(
                        user.getUser_id(),
                        user.getUser_name(),
                        user.getEmail(),
                        user.getPhone_no()
                ))
                .toList();
    }

    // ✅ GET user by ID (DTO)
    public UserDTO getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        return new UserDTO(
                user.getUser_id(),
                user.getUser_name(),
                user.getEmail(),
                user.getPhone_no()
        );
    }

    // ✅ CREATE user
    public User createUser(User user) {
        return userRepository.save(user);
    }

    // ✅ UPDATE user
    public User updateUser(int id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found with id: " + id));

        user.setUser_name(updatedUser.getUser_name());
        user.setEmail(updatedUser.getEmail());
        user.setPhone_no(updatedUser.getPhone_no());
        user.setPassword(updatedUser.getPassword());

        return userRepository.save(user);
    }

    // ✅ DELETE user
    public void deleteUser(int id) {
        userRepository.deleteById(id);
    }
}