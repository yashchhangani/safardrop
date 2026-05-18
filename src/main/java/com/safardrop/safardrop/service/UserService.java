package com.safardrop.safardrop.service;

import com.safardrop.safardrop.dto.Userdto;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.exception.ResourceNotFoundException;
import com.safardrop.safardrop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public UserService(UserRepository userRepository, PasswordService passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    public User createUser(User user) {
        if (user.getEmail() == null || user.getEmail().isBlank()) {
            throw new IllegalArgumentException("Email is required");
        }
        if (user.getPassword() == null || user.getPassword().isBlank()) {
            throw new IllegalArgumentException("Password is required");
        }

        user.setEmail(user.getEmail().trim());
        Optional<User> existingUser = userRepository.findByEmail(user.getEmail());

        if (existingUser.isPresent()) {
            throw new IllegalArgumentException("Email already exists!");
        }

        normalizeRole(user);
        user.setPassword(passwordService.encode(user.getPassword()));

        return userRepository.save(user);
    }

    public User registerUser(User user) {
        return createUser(user);
    }

    public User authenticateUser(String email, String password, String role) {
        if (email == null || password == null || role == null) {
            return null;
        }

        if (email.isBlank() || password.isBlank() || role.isBlank()) {
            return null;
        }

        Optional<User> user = userRepository.findByEmail(email.trim());

        if (user.isPresent()) {
            User existingUser = normalizeRole(user.get());

            boolean passwordMatches = passwordService.matches(password.trim(), existingUser.getPassword());
            boolean roleMatches = existingUser.getRole().name().equalsIgnoreCase(role.trim());

            if (passwordMatches && roleMatches) {
                if (!passwordService.isEncoded(existingUser.getPassword())) {
                    existingUser.setPassword(passwordService.encode(password.trim()));
                    existingUser = userRepository.save(existingUser);
                }
                return existingUser;
            }
        }

        return null;
    }

    public List<Userdto> getAllUsers() {
        return userRepository.findAll()
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    public Optional<User> findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Userdto getUserById(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        return toDto(user);
    }

    public User updateUser(int id, User updatedUser) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setUser_name(updatedUser.getUser_name());
        user.setEmail(updatedUser.getEmail());
        user.setPhone_no(updatedUser.getPhone_no());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isBlank()) {
            if (passwordService.isEncoded(updatedUser.getPassword())) {
                user.setPassword(updatedUser.getPassword());
            } else {
                user.setPassword(passwordService.encode(updatedUser.getPassword()));
            }
        }

        return userRepository.save(user);
    }

    public User upgradeRole(int id, UserRole targetRole) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        user.setRole(targetRole);
        return userRepository.save(user);
    }

    public void deleteUser(int id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        userRepository.delete(user);
    }

    private Userdto toDto(User user) {
        User normalizedUser = normalizeRole(user);

        return new Userdto(
                normalizedUser.getUser_id(),
                normalizedUser.getUser_name(),
                normalizedUser.getEmail(),
                null,
                normalizedUser.getPhone_no(),
                normalizedUser.getRole().name()
        );
    }

    private User normalizeRole(User user) {
        if (user.getRole() == null) {
            user.setRole(UserRole.USER);
        }
        return user;
    }
}
