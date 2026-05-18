package com.safardrop.safardrop.repository;

import com.safardrop.safardrop.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Integer> {
    List<Booking> findByCustomerId(int customerId);
    List<Booking> findByTripId(int tripId);
}