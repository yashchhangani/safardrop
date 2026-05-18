package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.RoleUpdateRequest;
import com.safardrop.safardrop.dto.Userdto;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.exception.ResourceNotFoundException;
import com.safardrop.safardrop.security.AuthTokenService;
import com.safardrop.safardrop.security.AuthenticatedUser;
import com.safardrop.safardrop.security.RequestAuthorizationService;
import com.safardrop.safardrop.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;
import java.util.LinkedHashMap;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;
import static org.springframework.http.HttpStatus.FORBIDDEN;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;
    private final RequestAuthorizationService requestAuthorizationService;
    private final AuthTokenService authTokenService;

    public UserController(
            UserService userService,
            RequestAuthorizationService requestAuthorizationService,
            AuthTokenService authTokenService
    ) {
        this.userService = userService;
        this.requestAuthorizationService = requestAuthorizationService;
        this.authTokenService = authTokenService;
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody User user) {
        if (userService.findByEmail(user.getEmail()).isPresent()) {
            return ResponseEntity
                    .badRequest()
                    .body("Email already exists");
        }

        user.setRole(UserRole.USER);
        User savedUser = userService.createUser(user);

        Userdto userDTO = new Userdto(
                savedUser.getUser_id(),
                savedUser.getUser_name(),
                savedUser.getEmail(),
                null,
                savedUser.getPhone_no(),
                savedUser.getRole().name()
        );

        return ResponseEntity.ok(userDTO);
    }

    @GetMapping
    public ResponseEntity<List<Userdto>> getAllUsers(HttpServletRequest request) {
        requestAuthorizationService.requireRole(request, UserRole.ADMIN);
        return ResponseEntity.ok(userService.getAllUsers());
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable int id, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, id);
        try {
            Userdto user = userService.getUserById(id);
            return ResponseEntity.ok(user);
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<?> updateUser(@PathVariable int id, @Valid @RequestBody User user, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, id);
        try {
            User updated = userService.updateUser(id, user);
            return ResponseEntity.ok(userService.getUserById(updated.getUser_id()));
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }

    @PutMapping("/{id}/role")
    public ResponseEntity<?> updateRole(
            @PathVariable int id,
            @Valid @RequestBody RoleUpdateRequest roleUpdateRequest,
            HttpServletRequest request
    ) {
        AuthenticatedUser authenticatedUser = requestAuthorizationService.requireSelfOrAdmin(request, id);

        UserRole targetRole;
        try {
            targetRole = UserRole.valueOf(roleUpdateRequest.getRole().trim().toUpperCase());
        } catch (IllegalArgumentException ex) {
            throw new ResponseStatusException(BAD_REQUEST, "Invalid role");
        }

        if (!authenticatedUser.isAdmin() && targetRole != UserRole.TRAVELLER && targetRole != UserRole.USER) {
            throw new ResponseStatusException(FORBIDDEN, "You can only switch your account between user and traveller");
        }

        User updatedUser = userService.upgradeRole(id, targetRole);
        Map<String, Object> response = new LinkedHashMap<>();
        response.put("message", "Role updated successfully");
        response.put("userId", updatedUser.getUser_id());
        response.put("role", updatedUser.getRole().name());

        if (authenticatedUser.getUserId() == updatedUser.getUser_id()) {
            response.put("token", authTokenService.generateToken(updatedUser));
        }

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable int id, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, id);
        try {
            userService.deleteUser(id);
            return ResponseEntity.ok("User deleted successfully");
        } catch (ResourceNotFoundException e) {
            return ResponseEntity.status(404).body(e.getMessage());
        }
    }
}
