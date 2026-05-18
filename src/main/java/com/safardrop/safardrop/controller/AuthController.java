package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.Logindto;
import com.safardrop.safardrop.dto.SignupRequest;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.security.AuthTokenService;
import com.safardrop.safardrop.service.UserService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final UserService userService;
    private final AuthTokenService authTokenService;

    public AuthController(UserService userService, AuthTokenService authTokenService) {
        this.userService = userService;
        this.authTokenService = authTokenService;
    }

    @PostMapping("/login")
    public ResponseEntity<?> login(@Valid @RequestBody Logindto loginDto) {
        User user = userService.authenticateUser(
                loginDto.getEmail(),
                loginDto.getPassword(),
                loginDto.getRole()
        );

        if (user == null) {
            return ResponseEntity
                    .badRequest()
                    .body(Map.of("message", "Invalid email, password, or role"));
        }

        return ResponseEntity.ok(
                Map.of(
                        "message", "Login successful",
                        "userId", user.getUser_id(),
                        "userName", user.getUser_name(),
                        "email", user.getEmail(),
                        "role", user.getRole().name(),
                        "token", authTokenService.generateToken(user)
                )
        );
    }

    @PostMapping("/signup")
    public ResponseEntity<?> signup(@Valid @RequestBody SignupRequest signupRequest) {
        User user = new User();
        user.setUser_name(signupRequest.getUser_name());
        user.setEmail(signupRequest.getEmail());
        user.setPhone_no(signupRequest.getPhone_no());
        user.setPassword(signupRequest.getPassword());
        user.setRole(UserRole.USER);

        User savedUser = userService.registerUser(user);

        return ResponseEntity.ok(
                Map.of(
                        "message", "Signup successful",
                        "userId", savedUser.getUser_id(),
                        "role", savedUser.getRole().name()
                )
        );
    }
}
