package com.safardrop.safardrop.service;

import com.safardrop.safardrop.dto.TripDTO;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.repository.TripRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.NoSuchElementException;
import java.util.stream.Collectors;

@Service
public class TripService {

    private final TripRepository tripRepo;

    public TripService(TripRepository tripRepo) {
        this.tripRepo = tripRepo;
    }

    // Convert entity to DTO
    private TripDTO toDTO(Trip trip) {
        return new TripDTO(
                trip.getTripId(),
                trip.getUserId(),
                trip.getPickupLocation(),   // ✅ FIXED
                trip.getDropLocation(),     // ✅ FIXED
                trip.getCreatedAt(),        // ✅ FIXED
                trip.getTripStatus()        // ✅ FIXED
        );
    }

    // Get all trips
    public List<TripDTO> getAllTrips() {
        return tripRepo.findAll()
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Get trip by ID
    public TripDTO getTripById(int id) {
        Trip trip = tripRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Trip not found with ID " + id));
        return toDTO(trip);
    }

    // Get trips by user
    public List<TripDTO> getTripsByUser(int userId) {
        return tripRepo.findByUserId(userId)
                .stream()
                .map(this::toDTO)
                .collect(Collectors.toList());
    }

    // Create trip
    public TripDTO createTrip(Trip trip) {
        Trip saved = tripRepo.save(trip);
        return toDTO(saved);
    }

    // Update trip
    public TripDTO updateTrip(int id, Trip tripDetails) {
        Trip trip = tripRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Trip not found with ID " + id));

        trip.setUserId(tripDetails.getUserId());
        trip.setPickupLocation(tripDetails.getPickupLocation());   // ✅ FIXED
        trip.setDropLocation(tripDetails.getDropLocation());       // ✅ FIXED
        trip.setCreatedAt(tripDetails.getCreatedAt());             // ✅ FIXED
        trip.setTripStatus(tripDetails.getTripStatus());           // ✅ FIXED

        Trip updated = tripRepo.save(trip);
        return toDTO(updated);
    }

    // Delete trip
    public void deleteTrip(int id) {
        Trip trip = tripRepo.findById(id)
                .orElseThrow(() -> new NoSuchElementException("Trip not found with ID " + id));
        tripRepo.delete(trip);
    }
}