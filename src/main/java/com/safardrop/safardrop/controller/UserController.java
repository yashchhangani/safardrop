package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.service.UserService;
import com.safardrop.safardrop.dto.UserDTO;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/users")
public class UserController {

    private final UserService userService;

    // ✅ Correct constructor
    public UserController(UserService userService) {
        this.userService = userService;
    }

    // ✅ GET all users
    @GetMapping
    public List<UserDTO> getAllUsers() {
        return userService.getAllUsers();
    }

    // ✅ GET user by ID
    @GetMapping("/{id}")
    public UserDTO getUserById(@PathVariable int id) {
        return userService.getUserById(id);
    }

    // ✅ CREATE user
    @PostMapping
    public User createUser(@Valid @RequestBody User user) {
        return userService.createUser(user);
    }

    // ✅ UPDATE user
    @PutMapping("/{id}")
    public User updateUser(@PathVariable int id, @Valid @RequestBody User user) {
        return userService.updateUser(id, user);
    }

    // ✅ DELETE user
    @DeleteMapping("/{id}")
    public String deleteUser(@PathVariable int id) {
        userService.deleteUser(id);
        return "User deleted successfully";
    }
}