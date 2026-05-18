package com.safardrop.safardrop;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.service.UserService;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;

import static org.junit.jupiter.api.Assertions.assertNotNull;

@SpringBootTest
class AuthFlowTest {

    @Autowired
    private UserService userService;

    @Test
    void registerThenAuthenticateShouldWork() {
        User user = new User();
        user.setUser_name("Auth Test");
        user.setEmail("auth-flow@example.com");
        user.setPhone_no("9876543210");
        user.setPassword("Pass@123");
        user.setRole(UserRole.USER);

        userService.registerUser(user);

        User authenticated = userService.authenticateUser("auth-flow@example.com", "Pass@123", "USER");
        assertNotNull(authenticated);
    }
}
