package com.safardrop.safardrop.service;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class UserPasswordBackfillService implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserPasswordBackfillService.class);

    private final UserRepository userRepository;
    private final PasswordService passwordService;

    public UserPasswordBackfillService(UserRepository userRepository, PasswordService passwordService) {
        this.userRepository = userRepository;
        this.passwordService = passwordService;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        List<User> users = userRepository.findAll();
        int updatedUsers = 0;

        for (User user : users) {
            if (user.getPassword() != null && !user.getPassword().isBlank() && !passwordService.isEncoded(user.getPassword())) {
                user.setPassword(passwordService.encode(user.getPassword()));
                updatedUsers++;
            }
        }

        if (updatedUsers > 0) {
            userRepository.saveAll(users);
            logger.info("User password backfill completed. Updated {} legacy passwords to BCrypt.", updatedUsers);
        } else {
            logger.info("User password backfill skipped. All passwords already use BCrypt.");
        }
    }
}
