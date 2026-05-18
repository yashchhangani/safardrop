package com.safardrop.safardrop.security;

import com.safardrop.safardrop.entity.UserRole;

public class AuthenticatedUser {
    private final int userId;
    private final String email;
    private final UserRole role;

    public AuthenticatedUser(int userId, String email, UserRole role) {
        this.userId = userId;
        this.email = email;
        this.role = role;
    }

    public int getUserId() {
        return userId;
    }

    public String getEmail() {
        return email;
    }

    public UserRole getRole() {
        return role;
    }

    public boolean isAdmin() {
        return role == UserRole.ADMIN;
    }
}
