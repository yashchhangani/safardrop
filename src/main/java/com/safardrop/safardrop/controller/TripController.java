package com.safardrop.safardrop.controller;

import com.safardrop.safardrop.dto.TripDTO;
import com.safardrop.safardrop.entity.Trip;
import com.safardrop.safardrop.security.RequestAuthorizationService;
import com.safardrop.safardrop.service.TripService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/trips")
public class TripController {

    private final TripService tripService;
    private final RequestAuthorizationService requestAuthorizationService;

    public TripController(TripService tripService, RequestAuthorizationService requestAuthorizationService) {
        this.tripService = tripService;
        this.requestAuthorizationService = requestAuthorizationService;
    }

    @GetMapping
    public ResponseEntity<List<TripDTO>> getAllTrips() {
        return ResponseEntity.ok(tripService.getAllTrips());
    }

    @GetMapping("/search")
    public ResponseEntity<List<TripDTO>> searchTrips(
            @RequestParam String origin,
            @RequestParam String destination
    ) {
        return ResponseEntity.ok(tripService.searchTrips(origin, destination));
    }

    @GetMapping("/{tripId}")
    public ResponseEntity<TripDTO> getTripById(@PathVariable int tripId) {
        return ResponseEntity.ok(tripService.getTripById(tripId));
    }

    @PostMapping
    public ResponseEntity<?> createTrip(@Valid @RequestBody Trip trip, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, trip.getUserId());
        try {
            return ResponseEntity.ok(tripService.createTrip(trip));
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of("message", e.getMessage()));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("message", "Failed to create trip"));
        }
    }

    @GetMapping("/my")
    public ResponseEntity<List<TripDTO>> getMyTrips(@RequestParam int userId, HttpServletRequest request) {
        requestAuthorizationService.requireSelfOrAdmin(request, userId);
        return ResponseEntity.ok(tripService.getTripsByUser(userId));
    }
}
