package com.safardrop.safardrop.repository;

import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {

    Optional<User> findByEmail(String email);

    long countByRoleIsNull();

    @Modifying
    @Query("update User u set u.role = :role where u.role is null")
    int assignRoleToUsersWithoutRole(@Param("role") UserRole role);
}
