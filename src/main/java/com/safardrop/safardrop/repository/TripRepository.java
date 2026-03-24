package com.safardrop.safardrop.repository;

import com.safardrop.safardrop.entity.Trip;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface TripRepository extends JpaRepository<Trip, Integer> {

    // Find trips by user ID
    List<Trip> findByUserId(int userId);

    // ✅ FIXED: use entity field name (tripStatus)
    List<Trip> findByTripStatus(String tripStatus);
}