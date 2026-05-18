package com.safardrop.safardrop.repository;

import com.safardrop.safardrop.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TripRepository extends JpaRepository<Trip, Integer> {

    // ✅ SEARCH
    List<Trip> findByOriginAndDestination(String origin, String destination);

    // 🔥 NEW
    List<Trip> findByUserId(int userId);
}
