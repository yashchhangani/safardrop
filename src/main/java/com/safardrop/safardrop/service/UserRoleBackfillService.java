package com.safardrop.safardrop.service;

import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

@Component
public class UserRoleBackfillService implements ApplicationRunner {

    private static final Logger logger = LoggerFactory.getLogger(UserRoleBackfillService.class);

    private final UserRepository userRepository;

    public UserRoleBackfillService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public void run(ApplicationArguments args) {
        long usersWithoutRole = userRepository.countByRoleIsNull();

        if (usersWithoutRole == 0) {
            logger.info("User role backfill skipped. All users already have roles.");
            return;
        }

        int updatedUsers = userRepository.assignRoleToUsersWithoutRole(UserRole.USER);
        logger.info("User role backfill completed. Updated {} legacy users to USER role.", updatedUsers);
    }
}
