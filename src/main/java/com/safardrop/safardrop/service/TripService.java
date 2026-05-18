package com.safardrop.safardrop.service;

import com.safardrop.safardrop.dto.TripDTO;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.entity.User;
import com.safardrop.safardrop.entity.UserRole;
import com.safardrop.safardrop.exception.ResourceNotFoundException;
import com.safardrop.safardrop.repository.TripRepository;
import com.safardrop.safardrop.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TripService {

    private final TripRepository tripRepository;
    private final UserRepository userRepository;

    public TripService(TripRepository tripRepository, UserRepository userRepository) {
        this.tripRepository = tripRepository;
        this.userRepository = userRepository;
    }

    public List<TripDTO> getAllTrips() {
        return tripRepository.findAll().stream().map(this::toDto).toList();
    }

    public List<TripDTO> searchTrips(String origin, String destination) {
        return tripRepository.findByOriginAndDestination(origin, destination)
                .stream()
                .map(this::toDto)
                .toList();
    }

    public TripDTO createTrip(Trip trip) {
        User creator = userRepository.findById(trip.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("User not found"));

        UserRole creatorRole = creator.getRole() == null ? UserRole.USER : creator.getRole();

        if (creatorRole != UserRole.TRAVELLER && creatorRole != UserRole.ADMIN) {
            throw new IllegalArgumentException("Only traveller or admin accounts can create trips");
        }

        return toDto(tripRepository.save(trip));
    }

    public TripDTO getTripById(int tripId) {
        Trip trip = tripRepository.findById(tripId)
                .orElseThrow(() -> new ResourceNotFoundException("Trip not found"));
        return toDto(trip);
    }

    public List<TripDTO> getTripsByUser(int userId) {
        return tripRepository.findByUserId(userId).stream().map(this::toDto).toList();
    }

    private TripDTO toDto(Trip trip) {
        User owner = userRepository.findById(trip.getUserId())
                .orElseThrow(() -> new ResourceNotFoundException("Trip owner not found"));

        TripDTO dto = new TripDTO();
        dto.setTripId(trip.getTripId());
        dto.setUserId(trip.getUserId());
        dto.setOrigin(trip.getOrigin());
        dto.setPickupArea(trip.getPickupArea());
        dto.setDestination(trip.getDestination());
        dto.setDropArea(trip.getDropArea());
        dto.setTravelDate(trip.getTravelDate());
        dto.setCapacity(trip.getCapacity());
        dto.setTripStatus(trip.getTripStatus());
        dto.setCreatedAt(trip.getCreatedAt());
        dto.setFare(trip.getFare());
        dto.setOwnerName(owner.getUser_name());
        dto.setOwnerEmail(owner.getEmail());
        return dto;
    }
}
